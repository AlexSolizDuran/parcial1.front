// components/ViviendaCard.tsx
import React from "react";
import { ViviendaGet } from "@/types/residencias/vivienda";
import { DollarSign, Maximize2, Tag, Home, Zap } from 'lucide-react';
import Button2 from "../buttons/Button2";
import { DetailsIcon } from "../icons";

interface ViviendaCardProps {
  vivienda: ViviendaGet;
}

export default function ViviendaCard({ vivienda }: ViviendaCardProps) {
  return (
    // ¡CAMBIO CLAVE AQUÍ!
    // 1. Reemplazamos 'max-w-lg' por 'w-full' para que ocupe todo el ancho del contenedor padre.
    // 2. Quitamos 'mx-auto' ya que 'w-full' ya no necesita centrarse.
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">

      {/* Sección de la imagen (o placeholder) */}
      <div className="relative">
        {vivienda.foto ? (
          <img
            src={vivienda.foto}
            alt={`Foto vivienda ${vivienda.nro_vivienda}`}
            className="w-full h-56 object-cover"
          />
        ) : (
          // Placeholder mejorado
          <div className="w-full h-56 bg-gray-300 flex items-center justify-center">
            <Home className="w-12 h-12 text-gray-500" />
            <span className="text-gray-600 font-semibold ml-2">Sin foto disponible</span>
          </div>
        )}

        {/* Etiqueta de estado en la esquina (Badge) */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full 
            ${vivienda.estado  ? 'bg-green-500 text-white' :
              vivienda.estado ? 'bg-red-500 text-white' : 'bg-yellow-500 text-gray-800'}`
          }
        >
          {vivienda.estado}
        </span>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-5 text-center">

        {/* Título de la vivienda */}
        <h2 className="font-extrabold text-2xl text-gray-900 mb-2">
          Vivienda {vivienda.nro_vivienda}
        </h2>

        {/* Detalles clave: Usamos Flexbox para alinear iconos y texto */}
        <div className="space-y-2 mt-4 text-gray-700">

          {/* Superficie */}
          <div className="flex items-center">
            <Maximize2 className="w-4 h-4 text-indigo-500 mr-2" />
            <p><span className="font-medium">Superficie:</span> {vivienda.superficie} m²</p>
          </div>

          {/* Faltaban los precios, los añado de la versión anterior para completarla */}
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-green-500 mr-2" />
            <p>
              <span className="font-medium">Alquiler:</span> ${vivienda.precio_alquiler}
            </p>
          </div>

          <div className="flex items-center">
            <Tag className="w-4 h-4 text-orange-500 mr-2" />
            <p>
              <span className="font-medium">Anticrético:</span> ${vivienda.precio_anticretico}
            </p>
          </div>
          <Button2
            href={`/admin/residencias/viviendas/${vivienda.id}`} size="sm" variant="show" // URL de ejemplo para la página de detalles
          >
            <DetailsIcon /> Ver
          </Button2>
        </div>

        

      </div>
    </div>
  );
}