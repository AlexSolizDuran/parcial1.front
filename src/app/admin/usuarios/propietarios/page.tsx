"use client";
import useSWR from "swr";

import { apiFetcher } from "@/fetcher";
import { useState } from "react";
import { Suspense } from "react";
import SuccessMessage from "@/components/message/SuccessMessage";
import { Propietario } from "@/types/usuarios/propietario";
import CardPropietario from "@/components/cards/CardPropietario";
import Button2 from "@/components/buttons/Button2";
import { PaginatedResponse } from "@/types/paginacion/paginacion";



export default function ListaUsuarios() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [page, setPage] = useState(1)

  const { data:propietario, error, isLoading } = useSWR<PaginatedResponse<Propietario>>(
    `${url}/residencias/propietario/?page=${page}`,
    apiFetcher
  );
  
  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error al cargar propietario: {error.message}
      </div>
    );
  }
  if (isLoading) return <div className="p-4">Cargando Propietarios...</div>;
  return (
    <div>
      {/*AVISO DE CREADO, */}
      <Suspense fallback={<div>Cargando...</div>}>
        <SuccessMessage table="Persona" />
      </Suspense>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Gestión de Propietarios</h1>
        {/*BOTON PARA AÑADIR MAS PERSONAS */}
        <Button2 href="/admin/usuarios/propietarios/crear" size="md" variant="create"> Añadir</Button2>
      </div>
      {/*AQUI ESTA LA CARD PARA PONER LOS DATOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {propietario?.results.map((propietario) => (
          <CardPropietario key={propietario.id} propietario={propietario} />
        ))}
      </div>

      {!isLoading && propietario?.results.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No se encontraron Propietarios registrados.</p>
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={!propietario?.previous}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-3 py-1 border rounded bg-gray-100">{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!propietario?.next}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
