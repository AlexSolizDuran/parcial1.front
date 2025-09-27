"use client";

import { Usuario } from "@/types/usuarios"; // Asegúrate que la ruta a tus tipos sea correcta

// Iconos para los botones (puedes usar una librería como react-icons)
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

interface CardUserProps {
  usuario: Usuario;
  
}

const CardUser = ({ usuario }: CardUserProps) => {
  const avatarInitial = usuario.persona.nombre ? usuario.persona.nombre.charAt(0).toUpperCase() : "?";

  return (
    <div className="bg-white  shadow-lg rounded-xl p-4 transition-shadow hover:shadow-xl w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-16 h-16 rounded-full  flex items-center justify-center border-2 border-white dark:border-gray-800">
          <span className="text-3xl font-bold text-white">{usuario.persona.foto}</span>
        </div>

        {/* Información del Usuario */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <p className="text-lg font-bold text-blue-900  truncate">
            {usuario.persona.nombre} {usuario.persona.apellido}
          </p>
          <p className="text-sm text-blue-900 truncate">{usuario.email}</p>
          
        </div>

       
        
      </div>
    </div>
  );
};

export default CardUser;