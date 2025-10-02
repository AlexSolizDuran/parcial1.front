"use client"

import Button2 from "@/components/buttons/Button2";
import ContratoCard from "@/components/cards/CardContrato";
import { apiFetcher } from "@/fetcher";
import { PaginatedResponse } from "@/types/paginacion/paginacion";
import { ContratoGet } from "@/types/residencias/contrato";
import { useState } from "react";
import useSWR from "swr";

export default function home(){
    const [page,setPage] = useState(1);
    const contratoUrl = `/api/residencias/contrato/`

    const {data:contratos,isLoading,error} = useSWR<PaginatedResponse<ContratoGet>>(contratoUrl,apiFetcher)
    console.log(contratos?.results)
    return (
      <div>
          {/* NUEVA SECCIÓN: Título y Botón de Acción */}
          <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h1 className="text-3xl font-bold text-gray-800">
                  Lista de Contratos 📄
              </h1>
              <Button2 href={`/admin/residencias/contratos/crear/`} size="md" variant="create"> Añadir</Button2>
          </div>
          
          {/* Contenido existente: Grid de Contratos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {contratos?.results.map((contrato) => (
                  <ContratoCard key={contrato.id} contrato={contrato} />
              ))}
          </div>
      
          {/* Paginación existente */}
          <div className="flex justify-center mt-6 gap-2">
              <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={!contratos?.previous}
                  className="px-3 py-1 border rounded disabled:opacity-50"
              >
                  Anterior
              </button>
              <span className="px-3 py-1 border rounded bg-gray-100">{page}</span>
              <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!contratos?.next}
                  className="px-3 py-1 border rounded disabled:opacity-50"
              >
                  Siguiente
              </button>
          </div>
      </div>
  );
}