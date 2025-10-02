"use client";
import React, { useState, use } from "react";
import Button2 from "@/components/buttons/Button2";
import ButtonDelete from "@/components/buttons/ButtonDelete";
import {
  CalendarIcon,
  DeleteIcon,
  EditIcon,
  EmailIcon,
  GenderIcon,
  IdCardIcon,
  LocationIcon,
  PhoneIcon,
  UserIcon,
} from "@/components/icons";
import { apiFetcher } from "@/fetcher";
import { Inquilino } from "@/types/usuarios/inquilino";
import { useRouter } from "next/navigation";

import useSWR, { mutate } from "swr";

export default function home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const inquilinoUrl = `/api/usuari/inquilino/${id}/`;
  const listUrl = `/api/usuari/inquilino/`;

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const shouldFetch = !isDeleting;
  const {
    data: inquilino,
    isLoading,
    error,
  } = useSWR<Inquilino>(shouldFetch ? inquilinoUrl : null, apiFetcher);

  if (isLoading)
    return (
      <div className="text-center p-10">
        Cargando detalles del Inquilinos...
      </div>
    );
  if (error)
    return (
      <div className="text-center p-10 text-red-500">
        Error al cargar los Inquilinos: {error.message}
      </div>
    );
  if (!inquilino)
    return (
      <div className="text-center p-10">No se encontró el Inquilinos.</div>
    );

  const handleDelete = async () => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar a ${inquilino.usuario_detail?.persona?.nombre} ${inquilino.usuario_detail?.persona?.apellido}? Esta acción no se puede deshacer.`
      )
    )
      return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await apiFetcher(inquilinoUrl, { method: "DELETE" });

      // opcional: limpiar cache de SWR de lista
      mutate(listUrl);

      // redirigir inmediatamente
      router.push("/admin/usuarios/inquilinos?deleted=true");
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
          {inquilino.usuario_detail?.persona.foto ? (
            <img
              src={inquilino.usuario_detail?.persona.foto}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-4xl font-bold text-white">
              {inquilino.usuario_detail?.persona.nombre
                ?.charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>

        {/* Información Principal */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            {inquilino.usuario_detail?.persona.nombre}{" "}
            {inquilino.usuario_detail?.persona.apellido}
          </h1>
        </div>
        {/* Botones de Acción */}
        <div className="flex items-center gap-3">
          <Button2
            href={`/admin/usuarios/inquilinos/${inquilino.usuario_detail?.id}/editar`}
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
            <UserIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="text-md text-gray-900">
                {inquilino.usuario_detail?.username || "No especificado"}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <EmailIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-md text-gray-900">
                {inquilino.usuario_detail?.email || "No especificado"}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <IdCardIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Cédula de Identidad
              </dt>
              <dd className="text-md text-gray-900">
                {inquilino.usuario_detail?.persona.ci || "No especificado"}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PhoneIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="text-md text-gray-900">
                {inquilino.usuario_detail?.persona.telefono ||
                  "No especificado"}
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
                {inquilino.usuario_detail?.persona.fecha_nacimiento
                  ? new Date(
                      inquilino.usuario_detail.persona.fecha_nacimiento
                    ).toLocaleDateString()
                  : "No especificado"}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GenderIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Género</dt>
              <dd className="text-md text-gray-900 capitalize">
                {inquilino.usuario_detail?.persona.genero || "No especificado"}
              </dd>
            </div>
          </div>
          <div className="sm:col-span-2 flex items-start gap-3">
            <LocationIcon />
            <div>
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd className="text-md text-gray-900">
                {inquilino.usuario_detail?.persona.direccion ||
                  "No especificada"}
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
