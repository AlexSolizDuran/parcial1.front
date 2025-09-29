"use client";

import { Inquilino } from "@/types/usuarios/inquilino";
import Button2 from "../buttons/Button2";
import { DetailsIcon } from "../icons";
// Iconos para los botones (puedes usar una librería como react-icons)

interface CardInquilinoProps {
    inquilino: Inquilino;
}

const CardInquilino = ({ inquilino }: CardInquilinoProps) => {
  const avatarInitial = inquilino.usuario_detail?.persona?.nombre ? inquilino.usuario_detail.persona?.nombre.charAt(0).toUpperCase() : "?";
    
  return (
    <div className="bg-white  shadow-lg rounded-xl p-4 transition-shadow hover:shadow-xl w-full">
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        {/* Avatar */}
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white">
          {/* Si `persona.foto` es una URL, usar <img>. Si no, mostrar inicial. */}
          {inquilino.usuario_detail?.persona?.foto ? (
            <img src={inquilino.usuario_detail?.persona?.foto} alt={`Foto de ${inquilino.usuario_detail.persona?.nombre}`} className=" w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-white">{avatarInitial}</span>
          )}
        </div>
        {/* Información del Usuario */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <p className="text-lg font-bold text-blue-900  truncate">
            {inquilino.usuario_detail?.persona?.nombre} {inquilino.usuario_detail?.persona?.apellido}
          </p>
          <p className="text-sm text-blue-900 truncate">{inquilino.usuario_detail?.email}</p>
        </div>

        <Button2
          href={`/admin/usuarios/inquilinos/${inquilino.id}`} size="sm" variant="show" // URL de ejemplo para la página de detalles
        >
          <DetailsIcon /> Ver
        </Button2>

      </div>
    </div>
  );
};

export default CardInquilino;