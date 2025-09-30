'use client';
import Button2 from "@/components/buttons/Button2";
import ButtonDelete from "@/components/buttons/ButtonDelete";
import { apiFetcher } from "@/fetcher";
import { PaginatedResponse } from "@/types/paginacion/paginacion";
import { TipoExpensaGet } from "@/types/pagos/expensa";
import { useState } from "react";
import useSWR from "swr";

export default function Home() {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const [page, setPage] = useState(1);
    const tipoExpensaUrl = `${url}/pago/tipo_expensa/?page=${page}`;

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const { data: tiposExpensa, isLoading, error, mutate } = useSWR<PaginatedResponse<TipoExpensaGet>>(tipoExpensaUrl, apiFetcher);

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Seguro de eliminar este tipo de expensa?")) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await apiFetcher(`${url}/pago/tipo_expensa/${id}/`, { method: "DELETE" });
            mutate(); // Refresca los datos
        } catch (err: any) {
            setDeleteError(err.message || "Error al eliminar el tipo de expensa.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (error) {
        return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;
    }
    if (isLoading) {
        return <div className="text-center">Cargando tipos de expensa...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">
                🏷️ Gestión de Tipos de Expensa
            </h1>
            <div className="mb-6">
                <Button2 href="/admin/cobros/expensas/tipo_expensa/crear" size="md" variant="create">
                    Crear Tipo de Expensa
                </Button2>
            </div>

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Descripción</th>
                            <th className="py-2 px-4 text-center text-sm font-semibold text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {tiposExpensa && tiposExpensa.results.length > 0 ? (
                            tiposExpensa.results.map(tipo => (
                                <tr key={tipo.id} className="border-t hover:bg-gray-50">
                                    <td className="py-3 px-4">{tipo.nombre}</td>
                                    <td className="py-3 px-4">{tipo.descripcion}</td>
                                    <td className="py-3 px-4 text-center">
                                        <ButtonDelete onDelete={() => handleDelete(Number(tipo.id))} label={isDeleting ? "Eliminando..." : "Eliminar"} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-500">No hay tipos de expensa registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <button onClick={() => setPage(page - 1)} disabled={!tiposExpensa?.previous} className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                    Anterior
                </button>
                <span>Página {page}</span>
                <button onClick={() => setPage(page + 1)} disabled={!tiposExpensa?.next} className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                    Siguiente
                </button>
            </div>
        </div>
    );
}