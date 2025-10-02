"use client"
import Button2 from "@/components/buttons/Button2";
import CardGuardia from "@/components/cards/cardGuardia";
import CardUser from "@/components/cards/CardUser";
import SuccessMessage from "@/components/message/SuccessMessage";
import { apiFetcher } from "@/fetcher";
import { PaginatedResponse } from "@/types/paginacion/paginacion";
import { SeguridadGet } from "@/types/usuarios/seguridad";
import { CardSim } from "lucide-react";
import { Suspense, useState } from "react";
import useSWR from "swr";

export default function home() {
    const [page, setPage] = useState(1)
    const seguridadUrl = `/api/usuari/seguridad/?page=${page}`

    const { data: seguridad, error, isLoading } = useSWR<PaginatedResponse<SeguridadGet>>(seguridadUrl, apiFetcher)

    if (error) return <div className="text-center p-10 text-red-500">Error al cargar los seguridad:  {error.message}</div>;
    if (!seguridad) return <div className="text-center p-10">No se encontró el seguridad.</div>;

    return (
        <div>
            {/*AVISO DE CREADO, */}
            <Suspense fallback={<div>Cargando...</div>}>
                <SuccessMessage table="Guardia" />
            </Suspense>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">Gestión de Guardias</h1>
                <Button2 href="/admin/usuarios/seguridad/crear" size="md" variant="create"> Añadir</Button2>
                {/*BOTON PARA AÑADIR MAS PERSONAS */}

            </div>
            {/*AQUI ESTA LA CARD PARA PONER LOS DATOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">

                {seguridad.results.map((seguridadItem, index) => {
                    // solo procesar si usuario existe
                    if (!seguridadItem.usuario_detail) return null;

                    return (
                        <CardGuardia
                            key={seguridadItem.id} // fallback a index si id no existe
                            seguridad={seguridadItem} // usuario ya no es undefined
                        />
                    );
                })}



            </div>

            {!isLoading && seguridad?.results.length === 0 && (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No se encontraron Guaridas registrados.</p>
                </div>
            )}

            {/* Paginación */}
            <div className="flex justify-center mt-6 gap-2">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={!seguridad?.previous}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="px-3 py-1 border rounded bg-gray-100">{page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!seguridad?.next}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    )
}