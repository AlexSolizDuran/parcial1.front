"use client";

import { Usuario } from "@/types/usuarios/usuarios"; // Asegúrate que la ruta a tus tipos sea correcta
import Button2 from "../buttons/Button2";

// Icono para el botón (puedes usar una librería como react-icons)
const DetailsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

interface CardUserProps {
  usuario: Usuario;
}

const CardUser = ({ usuario }: CardUserProps) => {
  const avatarInitial = usuario.persona.nombre
    ? usuario.persona.nombre.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 w-full 
                   transition-all duration-300 ease-in-out 
                   hover:shadow-lg hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center 
                        ring-2 ring-blue-100">
            {usuario.persona.foto ? (
              <img
                src={usuario.persona.foto}
                alt={`Foto de ${usuario.persona.nombre}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-semibold text-white">
                {avatarInitial}
              </span>
            )}
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <p className="text-lg font-semibold text-slate-800 truncate">
            {usuario.persona.nombre} {usuario.persona.apellido}
          </p>
          <p className="text-sm text-slate-500 truncate">{usuario.email}</p>
        </div>

        {/* Botón de Acción */}
        <div className="flex-shrink-0">
          <Button2
            href={`/admin/usuarios/usuarios/${usuario.id}`}
            size="sm"
            variant="show" // URL de ejemplo para la página de detalles
          >
            <DetailsIcon />
            Ver
          </Button2>
        </div>
      </div>
    </div>
  );
};

export default CardUser;