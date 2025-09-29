"use client"

import { apiFetcher } from "@/fetcher"
import useSWR, { mutate } from "swr"
import { use, useState } from "react"
import Image from "next/image"
import Button2 from "@/components/buttons/Button2"
import { DeleteIcon, EditIcon } from "@/components/icons"
import ButtonDelete from "@/components/buttons/ButtonDelete"
import { ViviendaGet } from "@/types/residencias/vivienda"
import { useRouter } from "next/navigation"




// --- Componente principal ---

export default function Home({ params }: { params: Promise<{ id: string }> }) {
    const url = process.env.NEXT_PUBLIC_API_URL
    const { id } = use(params)
    const viviendaUrl = `${url}/residencias/vivienda/${id}/`
    const listUrl = `${url}/residencias/vivienda/`

    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const { data: vivienda, error, isLoading } = useSWR<ViviendaGet>(viviendaUrl, apiFetcher)

    // --- Manejo de Estados (Simplificado) ---

    if (isLoading) {
        return (
            <div className="flex justify-center p-8 text-lg font-medium text-gray-500">
                Cargando datos de la vivienda...
            </div>
        )
    }

    if (error || !vivienda) {
        return (
            <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-md m-4">
                Error al cargar los detalles. ID: {id}.
            </div>
        )
    }

    const handleDelete = async () => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar a ${vivienda?.nro_vivienda} ? Esta acción no se puede deshacer.`)) {
            return;
        }
        setIsDeleting(true);
        setDeleteError(null);


        try {
            await apiFetcher(viviendaUrl, {
                method: 'DELETE',
            });
            mutate(listUrl);
            router.push("/admin/residencias/viviendas/?deleted=true");
        } catch (err: any) {
            setDeleteError(err.message || "Ocurrió un error al eliminar.");
        } finally {
            setIsDeleting(false);
        }
    };
    // --- Vista de Detalles (Simple y Directa) ---

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    Vivienda Nro. {vivienda.nro_vivienda}
                </h1>
                {/* El botón ahora va directamente aquí */}
                <Button2
                    href={`/admin/residencias/viviendas/${vivienda.id}/editar`} size="md" variant="update"
                >
                    <EditIcon /> Editar
                </Button2>
                <ButtonDelete onDelete={handleDelete} // tu función que hace el DELETE
                    icon={<DeleteIcon />}
                    label="Eliminar">

                </ButtonDelete>
            </div>
            {/* Bloque de Foto */}
            <div className="relative w-full h-56 bg-gray-100 rounded-md overflow-hidden mb-4">
                {vivienda.foto ? (
                    // Reemplazo del componente <Image> por la etiqueta <img> nativa
                    <img
                        src={vivienda.foto}
                        alt={`Foto de la Vivienda ${vivienda.nro_vivienda}`}
                        // Aplicamos estilos para simular layout="fill" y objectFit="cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className="absolute inset-0 transition duration-300 hover:scale-105"
                    // Nota: El className 'absolute inset-0' requiere que el div padre tenga 'relative'
                    />
                ) : (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        📸 No hay foto disponible
                    </div>
                )}
            </div>

            {/* Lista de Detalles */}
            <div className="space-y-3">

                <DetailItem label="Número" value={vivienda.nro_vivienda} />
                <DetailItem label="Superficie" value={`${vivienda.superficie} m²`} />
                <DetailItem label="Estado" value={vivienda.estado ? 'Ocupada' : 'Disponible'} colorClass={vivienda.estado ? 'text-red-600 font-bold' : 'text-green-600 font-bold'} />

                <hr className="my-2" />

                <DetailItem
                    label="Alquiler"
                    value={vivienda.precio_alquiler ? `$${vivienda.precio_alquiler}` : "N/D"}
                    colorClass="text-blue-700"
                />
                <DetailItem
                    label="Anticrético"
                    value={vivienda.precio_anticretico ? `$${vivienda.precio_anticretico}` : "N/D"}
                    colorClass="text-blue-700"
                />
            </div>
        </div>
    )
}

// --- Componente de Ayuda (Más simple aún) ---

interface DetailItemProps {
    label: string;
    value: string;
    colorClass?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, colorClass = "text-gray-700" }) => (
    <div className="flex justify-between items-center text-base">
        <span className="font-medium text-gray-500">{label}:</span>
        <span className={`font-semibold ${colorClass}`}>
            {value}
        </span>
    </div>
);