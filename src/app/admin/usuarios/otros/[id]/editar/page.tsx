"use client";
import React, { useReducer } from "react";
import PersonaForm from "@/components/vista/EditPersona"; // ajusta la ruta según tu estructura
import { useParams } from "next/navigation";
import BackButton from "@/components/buttons/BackButton";


export default function PersonaEditPage() {
  const params = useParams(); // Next.js 13 App Router
  const personaId = params?.id as string;

  return (
    <div className=" max-w-3xl mx-auto">
      <div className="flex justify-end gap-3">
        <BackButton label="Volver" className="mt-6" />
      </div>
      <div className="mt-6">
        <PersonaForm
          personaId={personaId}
          onSuccess={() => alert("Persona actualizada exitosamente!")}
        />
      </div>
    </div>
  );
}
