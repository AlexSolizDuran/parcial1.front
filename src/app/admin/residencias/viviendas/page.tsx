"use client"
import Button2 from "@/components/buttons/Button2";
import ViviendaCard from "@/components/cards/CardVivienda";
import { apiFetcher } from "@/fetcher";
import { PaginatedResponse } from "@/types/paginacion/paginacion";
import { ViviendaGet } from "@/types/residencias/vivienda";
import { useState } from "react";
import useSWR from "swr";

export default function home() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [page, setPage] = useState(1)
  const viviendasUrl = `${url}/residencias/vivienda/?page=${page}`

  const { data: viviendas, isLoading, error } = useSWR<PaginatedResponse<ViviendaGet>>(viviendasUrl, apiFetcher)
  if (isLoading) return <div>Cargando viviendas...</div>;
  if (error) return <div>Error al cargar viviendas: {error.message}</div>;

  return (
    <div className="p-4">

      {/* Encabezado con título y botón */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 sm:mb-0">
          Gestionar de Viviendas
        </h2>

        <Button2 href="/admin/residencias/viviendas/crear" size="md" variant="create">
          Añadir
        </Button2>
      </div>

      {/* Grid de Viviendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {viviendas?.results.map((vivienda) => (
          <ViviendaCard key={vivienda.id} vivienda={vivienda} />
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={!viviendas?.previous}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-3 py-1 border rounded bg-gray-100">{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!viviendas?.next}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>

  );
}