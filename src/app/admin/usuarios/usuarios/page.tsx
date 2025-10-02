"use client";
import useSWR from "swr";
import { Usuario } from "@/types/usuarios/usuarios";
import CardUser from "@/components/cards/CardUser";
import { apiFetcher } from "@/fetcher";
import { useState } from "react";
import { Suspense } from "react";
import SuccessMessage from "@/components/message/SuccessMessage";
interface PaginatedResponse<Usuario> {
  count: number;
  next: string | null;
  previous: string | null;
  results: Usuario[];
}


export default function ListaUsuarios() {
  
  const [page, setPage] = useState(1)
  const url = `/api/usuario/?page=${page}`

  const { data, error, isLoading } = useSWR<PaginatedResponse<Usuario>>(
    `/api/usuario/?page=${page}`,
    apiFetcher
  );

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error al cargar usuarios: {error.message}
      </div>
    );
  }
  if (isLoading) return <div className="p-4">Cargando usuarios...</div>;
  return (
    <div>
      {/*AVISO DE CREADO, */}
      <Suspense fallback={<div>Cargando...</div>}>
        <SuccessMessage table="Persona" />
      </Suspense>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Gestión de Usuarios</h1>
        {/*BOTON PARA AÑADIR MAS PERSONAS */}

      </div>
      {/*AQUI ESTA LA CARD PARA PONER LOS DATOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {data?.results.map((usuario) => (
          <CardUser key={usuario.id} usuario={usuario} />
        ))}
      </div>

      {!isLoading && data?.results.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No se encontraron Usuarios registrados.</p>
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
