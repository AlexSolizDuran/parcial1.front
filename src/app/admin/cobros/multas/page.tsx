"use client";
import Button2 from "@/components/buttons/Button2";
import { apiFetcher } from "@/fetcher";
import { PaginatedResponse } from "@/types/paginacion/paginacion";
import { MultaGet } from "@/types/pagos/multa";
import { useState } from "react";
import useSWR from "swr";

export default function Home() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [page, setPage] = useState(1);
  const multaUrl = `${url}/incidencia/multa/?page=${page}`;
  const deleteUrl = `${url}/incidencia/multa/`;

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: multas,
    isLoading,
    error,
    mutate,
  } = useSWR<PaginatedResponse<MultaGet>>(multaUrl, apiFetcher);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro de eliminar esta multa?")) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await apiFetcher(`${deleteUrl}${id}/`, { method: "DELETE" });
      mutate(); // refresca la data
    } catch (err: any) {
      setDeleteError(err.message || "Error al eliminar la multa.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error al cargar las multas: {error.message}
      </div>
    );
  }
  if (isLoading) {
    return <div className="text-center">Cargando Multas...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">
        🏛️ Gestión de Multas
      </h1>

      <div className="flex space-x-4 mb-6">
        <Button2 href="/admin/cobros/multas/crear" size="md" variant="create">
          Añadir Multa
        </Button2>
        <Button2
          href="/admin/cobros/multas/tipo_multa"
          size="md"
          variant="show"
        >
          Gestionar Tipos de Multa
        </Button2>
      </div>

      <div className="mt-8">
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                  Nombre
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                  Descripción
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                  Nombre del Usuario
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                  Monto
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                  Estado
                </th>

                <th className="py-2 px-4 text-center text-sm font-semibold text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {(multas?.results ?? []).length > 0 ? (
                (multas?.results ?? []).map((multa) => (
                  <tr key={multa.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {multa.tipo_detail.nombre || "—"}
                    </td>
                    <td className="py-3 px-4">{multa.descripcion || "—"}</td>
                    <td className="py-3 px-4">
                      {multa.usuario_detail.persona.nombre || "—"}
                    </td>
                    <td className="py-3 px-4">{multa.monto}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          multa.estado
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {multa.estado ? "Pagado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(Number(multa.id))}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 disabled:opacity-50"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No hay multas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!multas?.previous}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!multas?.next}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
