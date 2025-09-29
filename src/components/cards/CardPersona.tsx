"use client";

import { Persona } from "@/types/usuarios/usuarios";
import Button2 from "../buttons/Button2";

// Iconos para la información de contacto
const IdCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const DetailsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

interface CardPersonaProps {
  persona: Persona;
}

const CardPersona = ({ persona }: CardPersonaProps) => {
  const avatarInitial = persona.nombre ? persona.nombre.charAt(0).toUpperCase() : "?";

  return (
    <div className="bg-white  shadow-lg rounded-xl p-4 transition-shadow hover:shadow-xl w-full">
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        {/* Avatar */}
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white">
          {/* Si `persona.foto` es una URL, usar <img>. Si no, mostrar inicial. */}
          {persona.foto ? (
            <img src={persona.foto} className=" w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-white">{avatarInitial}</span>
          )}
        </div>
        {/* Información del Usuario */}
        <div className="flex-1 min-w-0 bg-white rounded-md shadow-sm">
          <h2 className="text-lg font-semibold text-blue-900 truncate">
            {persona.nombre} {persona.apellido}
          </h2>

          <dl className="mt-1 space-y-1 text-sm text-blue-700">
            <div className="flex items-center gap-2 truncate">
              <span className="inline-flex h-4 w-4 text-blue-500">
                <IdCardIcon />
              </span>
              <dd className="truncate">{persona.ci || "No CI"}</dd>
            </div>
            <div className="flex items-center gap-2 truncate">
              <span className="inline-flex h-4 w-4 text-blue-500">
                <PhoneIcon />
              </span>
              <dd className="truncate">{persona.telefono || "No teléfono"}</dd>
            </div>
          </dl>
        </div>



        <Button2
          href={`/admin/usuarios/otros/${persona.id}`} size="sm" variant="show" // URL de ejemplo para la página de detalles
        >
          <DetailsIcon /> Ver
        </Button2>

      </div>
    </div>
  );
};
export default CardPersona;
