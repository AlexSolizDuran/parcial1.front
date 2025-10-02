"use client";
import React from "react";
import { useParams } from "next/navigation";

import PersonaForm from "@/components/vista/EditPersona"; // <- Importa tu componente
import BackButton from "@/components/buttons/BackButton";
import UsuarioForm from "@/components/vista/EditUsuario";
import useSWR from "swr";
import { apiFetcher } from "@/fetcher";
import { Usuario } from "@/types/usuarios/usuarios";



export default function InquilinoEdit() {
  const params = useParams();
  const usuarioId = params?.id as string;
  const usuarioUrl = `/api/usuari/usuario/${usuarioId}/`;

  // SWR para obtener usuario (y su personaId)
  const { data: usuario, error, isLoading } = useSWR<Usuario>(usuarioUrl, apiFetcher);

  if (isLoading) return <div className="text-center p-10">Cargando datos...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error.message}</div>;
  if (!usuario) return <div className="text-center p-10">No se encontró el usuario.</div>;

  const personaId = usuario.persona?.id?.toString() ?? "";

  return (
    <div className=" max-w-3xl mx-auto">
      <div className="flex justify-end gap-3">
        <BackButton label="Volver" className="mt-6" />
      </div>

      <div className="mt-6">
        <UsuarioForm
          usuarioId={usuarioId}
          onSuccess={() => alert("Persona actualizada exitosamente!")}
        />
        <PersonaForm
          personaId={personaId}
          onSuccess={() => alert("Persona actualizada exitosamente!")}
        />
      </div>
    </div>
  );
}
