"use client";
import React, { useState, use } from "react";
import { useRouter } from "next/navigation";

import useSWR, { mutate } from "swr";
import { apiFetcher } from "@/fetcher"; // Asegúrate que este fetcher exista y funcione
import { Persona } from "@/types/usuarios/usuarios";
import Button2 from "@/components/buttons/Button2";
import ButtonDelete from "@/components/buttons/ButtonDelete";
import {
  CalendarIcon,
  DeleteIcon,
  EditIcon,
  GenderIcon,
  IdCardIcon,
  LocationIcon,
  PhoneIcon,
} from "@/components/icons";
// Iconos para la información

export default function PersonaDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const personaUrl = `/api/usuari/persona/${id}/`;
  const listUrl = `/api/usuari/persona/`;

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const shouldFetch = !isDeleting;
  const {
    data: persona,
    error,
    isLoading,
  } = useSWR<Persona>(shouldFetch ? personaUrl : null, apiFetcher);

  if (isLoading)
    return (
      <div className="text-center p-10">Cargando detalles de la persona...</div>
    );
  if (error)
    return (
      <div className="text-center p-10 text-red-500">
        Error al cargar los datos: {error.message}
      </div>
    );
  if (!persona)
    return <div className="text-center p-10">No se encontró la persona.</div>;

  const handleDelete = async () => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar a ${persona?.nombre} ${persona?.apellido}? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setIsDeleting(true); // React intentará renderizar

    // Esperamos un ciclo de render

    setDeleteError(null);
    try {
      await apiFetcher(personaUrl, {
        method: "DELETE",
      });
      mutate(listUrl);
      router.replace("/admin/usuarios/otros?deleted=true");
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
            <img
              src={persona.foto}
              alt={`Foto de ${persona.nombre}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-4xl font-bold text-white">
              {persona.nombre?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Información Principal */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            {persona.nombre} {persona.apellido}
          </h1>
          <p className="text-md text-gray-500 mt-1">Detalles de la Persona</p>
        </div>
        {/* Botones de Acción */}
        <div className="flex items-center gap-2">
          <Button2
            href={`/admin/usuarios/otros/${persona.id}/editar`}
            size="md"
            variant="update"
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
              <dt className="text-sm font-medium text-gray-500">
                Cédula de Identidad
              </dt>
              <dd className="text-md text-gray-900">
                {persona.ci || "No especificado"}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PhoneIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="text-md text-gray-900">
                {persona.telefono || "No especificado"}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Fecha de Nacimiento
              </dt>
              <dd className="text-md text-gray-900">
                {persona.fecha_nacimiento
                  ? new Date(persona.fecha_nacimiento).toLocaleDateString()
                  : "No especificado"}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GenderIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Género</dt>
              <dd className="text-md text-gray-900 capitalize">
                {persona.genero || "No especificado"}
              </dd>
            </div>
          </div>
          <div className="sm:col-span-2 flex items-start gap-3">
            <LocationIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd className="text-md text-gray-900">
                {persona.direccion || "No especificada"}
              </dd>
            </div>
          </div>
        </dl>
      </div>
      {deleteError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          <p>
            <strong>Error al eliminar:</strong> {deleteError}
          </p>
        </div>
      )}
    </div>
  );
}
