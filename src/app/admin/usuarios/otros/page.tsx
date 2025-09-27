"use client";

import { Suspense, useState } from "react";
import SuccessMessage from "@/components/message/SuccessMessage";
import useSWR from "swr";
import { Persona } from "@/types/usuarios";
import { apiFetcher } from "@/fetcher";
import CardPersona from "@/components/cards/CardPersona";
import Button1 from "@/components/buttons/Button1";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function PersonasListView() {
  const url = process.env.NEXT_PUBLIC_API_URL + "/usuario/personas/";
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useSWR<PaginatedResponse<Persona>>(
    `${url}?page=${page}`,
    apiFetcher
  );

  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <SuccessMessage />
      </Suspense>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Personas</h1>
        <Button1 href="/admin/usuarios/otros/crear" size="md" variant="primary">
          + Añadir Persona
        </Button1>
      </div>

      {error && (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">
          Error al cargar las personas: {error.message}
        </div>
      )}

      {isLoading && <div className="p-4">Cargando personas...</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {data?.results.map((persona) => (
          <CardPersona key={persona.id} persona={persona} />
        ))}
      </div>

      {!isLoading && data?.results.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No se encontraron personas registradas.</p>
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={!data?.previous}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-3 py-1 border rounded bg-gray-100">{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.next}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
