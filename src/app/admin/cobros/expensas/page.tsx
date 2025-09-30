'use client';
import Button2 from "@/components/buttons/Button2";
import ButtonDelete from "@/components/buttons/ButtonDelete";
import { apiFetcher } from "@/fetcher";
import { PaginatedResponse } from "@/types/paginacion/paginacion";
import { ExpensaGet } from "@/types/pagos/expensa";
import { useRouter } from "next/navigation";
    import { useMemo, useState } from "react";
import useSWR from "swr";

export default function Home(){
    const url = process.env.NEXT_PUBLIC_API_URL;
    const [page, setPage] = useState(1);
    const expensaUrl = `${url}/pago/expensa/?page=${page}`;
    const deleUrl = `${url}/pago/expensa/`;

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const router = useRouter();

    const { data: expensas, isLoading, error, mutate } = useSWR<PaginatedResponse<ExpensaGet>>(expensaUrl, apiFetcher);
    console.log(expensas);

    const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro de eliminar esta expensa?")) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
        await apiFetcher(`${deleUrl}${id}/`, { method: "DELETE" });
        mutate(); // Refresca los datos de la página actual
    } catch (err: any) {
        setDeleteError(err.message || "Error al eliminar la expensa.");
    } finally {
        setIsDeleting(false);
    }
};

    const groupedExpensas = useMemo(() => {
        if (!expensas) return {};

        return expensas.results.reduce((acc, expensa) => {
            // Se suma 1 día para evitar problemas de zona horaria que puedan mover la fecha al día anterior.
            const date = new Date(expensa.fecha_vencimiento);
            date.setDate(date.getDate() + 1);
            
            const monthYear = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
            const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

            if (!acc[capitalizedMonthYear]) {
                acc[capitalizedMonthYear] = [];
            }
            acc[capitalizedMonthYear].push(expensa);
            return acc;
        }, {} as Record<string, ExpensaGet[]>);
    }, [expensas]);

    if (error) {
        return (
            <div className="text-center text-red-500">Error al cargar las Expensas: {error.message}</div>
        );
    }
    if (isLoading) {
        return <div className="text-center">Cargando Expensas...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">
                🏛️ Gestión de Expensas
            </h1>
            <div className="flex space-x-4 mb-6">
                <Button2 href="/admin/cobros/expensas/crear" size="md" variant="create">Añadir Expensa</Button2>
                <Button2 href="/admin/cobros/expensas/tipo_expensa" size="md" variant="show">Gestionar Tipos de Expensa</Button2>
            </div>
            
            {Object.keys(groupedExpensas).length > 0 ? (
                Object.entries(groupedExpensas).map(([monthYear, expensesInMonth]) => (
                    <div key={monthYear} className="mt-8">
                        <h2 className="text-xl font-bold text-gray-600 mb-3">Expensas de {monthYear}</h2>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Descripción</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Vencimiento</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Monto</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Estado</th>
                                        <th className="py-2 px-4 text-center text-sm font-semibold text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {expensesInMonth.map(expensa => (
                                        <tr key={expensa.id} className="border-t hover:bg-gray-50">
                                            <td className="py-3 px-4">{expensa.tipo_expensa_detail?.nombre || "—"}</td>
                                            <td className="py-3 px-4">{expensa.tipo_expensa_detail?.descripcion || "—"}</td>
                                            <td className="py-3 px-4">{new Date(expensa.fecha_vencimiento).toLocaleDateString()}</td>
                                            <td className="py-3 px-4">${Number(expensa.monto).toFixed(2)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${expensa.estado ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                    {expensa.estado ? 'Pagado' : 'Pendiente'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <ButtonDelete onDelete={() => handleDelete(Number(expensa.id))} label={isDeleting ? "Eliminando..." : "Eliminar"} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500">No hay expensas registradas para mostrar.</div>
            )}

            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={!expensas?.previous}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Anterior
                </button>
                <span>Página {page}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={!expensas?.next}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}