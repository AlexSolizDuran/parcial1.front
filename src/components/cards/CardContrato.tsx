// components/ContratoCard.tsx
import React from "react";
import { DollarSign, Home, User, Calendar, Tag, Maximize2, FileText, Percent, ArrowRight } from 'lucide-react';
import { ContratoGet } from "@/types/residencias/contrato";
import Button2 from "../buttons/Button2";



interface ContratoCardProps {
    contrato: ContratoGet;
}

// Función auxiliar para formatear fechas (si necesitas formatear el string)
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
};


export default function ContratoCard({ contrato }: ContratoCardProps) {
    const { vivienda_detail, inquilino_detail } = contrato;
    const estadoVivienda = vivienda_detail?.estado || 'Desconocido';

    return (
        <div className="w-full max-w-md bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">

            {/* Encabezado */}
            <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200 rounded-t-xl">
                <FileText className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="font-bold text-lg text-gray-800">
                    Contrato #{contrato.id}
                </h2>
            </div>

            {/* Cuerpo con los Detalles */}
            <div className="p-5 space-y-4">
                {/* Detalle de Vivienda */}
                <div className="flex items-start">
                    <Home className="w-5 h-5 text-blue-900   mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <span className="font-semibold text-gray-700">Vivienda Nro:</span>
                        <p className="text-gray-600">{vivienda_detail.nro_vivienda}</p>
                    </div>
                </div>

                {/* Detalle de Tipo de Renta */}
                <div className="flex items-start">
                    <Tag className="w-5 h-5 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <span className="font-semibold text-gray-700">Tipo de Renta:</span>
                        <p className="text-gray-600">{contrato.tipo_renta}</p>
                    </div>
                </div>

                {/* Detalle de Expensa */}
                <div className="flex items-start">
                    <Percent className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <span className="font-semibold text-gray-700">Porcentaje Expensa:</span>
                        <p className="text-gray-600">{contrato.porcentaje_expensa}%</p>
                    </div>
                </div>
            </div>

            {/* Pie de Página con Descripción y Botón */}
            <div className="px-5 pb-5 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    <strong>Descripción:</strong> {contrato.descripcion || "No hay descripción disponible."}
                </p>
                <Button2
                
                href={`/admin/residencias/contratos/${contrato.id}`} variant="show">
                    Ver
                </Button2>
            </div>

        </div>
    );
}