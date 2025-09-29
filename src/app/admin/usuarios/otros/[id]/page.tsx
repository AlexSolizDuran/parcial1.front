"use client";
import React, { useState, use } from "react";
import { useRouter } from "next/navigation";

import useSWR, { mutate } from "swr";
import { apiFetcher } from "@/fetcher"; // Asegúrate que este fetcher exista y funcione
import { Persona } from "@/types/usuarios/usuarios";
import Button2 from "@/components/buttons/Button2";
import ButtonDelete from "@/components/buttons/ButtonDelete";
// Iconos para la información
const IdCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GenderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.986" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export default function PersonaDetail({ params }: { params: Promise<{ id: string }> }) {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { id } = use(params);
  const personaUrl = `${url}/usuario/personas/${id}/`;
  const listUrl = `${url}/usuario/personas/`;

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: persona, error, isLoading } = useSWR<Persona>(
    personaUrl,
    apiFetcher
  );

  if (isLoading) return <div className="text-center p-10">Cargando detalles de la persona...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error al cargar los datos: {error.message}</div>;
  if (!persona) return <div className="text-center p-10">No se encontró la persona.</div>;

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar a ${persona?.nombre} ${persona?.apellido}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await apiFetcher(personaUrl, {
        method: 'DELETE',
      });
      mutate(listUrl);
      router.push("/admin/usuarios/otros?deleted=true");
    } catch (err: any) {
      setDeleteError(err.message || "Ocurrió un error al eliminar.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Avatar Grande */}
        <div className="flex-shrink-0 w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white shadow-md">
          {persona.foto ? (
            <img src={persona.foto} alt={`Foto de ${persona.nombre}`} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-white">{persona.nombre?.charAt(0).toUpperCase()}</span>
          )}
        </div>

        {/* Información Principal */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{persona.nombre} {persona.apellido}</h1>
          <p className="text-md text-gray-500 mt-1">Detalles de la Persona</p>
        </div>
        {/* Botones de Acción */}
        <div className="flex items-center gap-2">
          <Button2
            href={`/admin/usuarios/otros/${persona.id}/editar`} size="md" variant="update"
          >
            <EditIcon /> Editar
          </Button2>
          <ButtonDelete
            onDelete={handleDelete} // tu función que hace el DELETE
            icon={<DeleteIcon />}
            label="Eliminar"
          />
        </div>
      </div>

      {/* Lista de Detalles */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
          <div className="flex items-center gap-3">
            <IdCardIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Cédula de Identidad</dt>
              <dd className="text-md text-gray-900">{persona.ci || 'No especificado'}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PhoneIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="text-md text-gray-900">{persona.telefono || 'No especificado'}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha de Nacimiento</dt>
              <dd className="text-md text-gray-900">{persona.fecha_nacimiento ? new Date(persona.fecha_nacimiento).toLocaleDateString() : 'No especificado'}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GenderIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Género</dt>
              <dd className="text-md text-gray-900 capitalize">{persona.genero || 'No especificado'}</dd>
            </div>
          </div>
          <div className="sm:col-span-2 flex items-start gap-3">
            <LocationIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd className="text-md text-gray-900">
                {persona.direccion || 'No especificada'}
              </dd>
            </div>
          </div>
        </dl>
      </div>
      {deleteError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          <p><strong>Error al eliminar:</strong> {deleteError}</p>
        </div>
      )}
    </div>
  );
}
