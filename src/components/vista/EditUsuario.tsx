"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { apiFetcher } from "@/fetcher";
import { Usuario } from "@/types/usuarios/usuarios";
import FormInput from "@/components/input/FormInput";

interface UsuarioFormProps {
  usuarioId: string;
  onSuccess?: (updatedPersona: Usuario) => void;
}

export default function UsuarioForm({ usuarioId, onSuccess }: UsuarioFormProps) {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_URL;
  const usuarioUrl = `${url}/usuario/usuarios/${usuarioId}/`;
  const listUrl = `${url}/usuario/usuarios/`;

  const { data: usuario, error, isLoading } = useSWR<Usuario>(usuarioUrl, apiFetcher);

  const [formData, setFormData] = useState<Partial<Usuario>>({});
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (usuario) {
      setFormData({
        username: usuario.username,
        email: usuario.email,
      });
    }
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.files) {
      setFotoFile(e.target.files[0] || null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) dataToSend.append(key, String(value));
      });

      const updatedUsuario = await apiFetcher<Usuario>(usuarioUrl, {
        method: "PATCH",
        body: dataToSend,
      });

      mutate(listUrl);
      mutate(usuarioUrl);

      if (onSuccess) onSuccess(updatedUsuario);
      else router.push(`/admin/usuarios/usuarios/${usuarioId}`);
    } catch (err: any) {
      setSubmitError(err.message || "Ocurrió un error al actualizar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return <div className="text-center p-10">Cargando datos...</div>;
  if (error)
    return (
      <div className="text-center p-10 text-red-500">
        Error al cargar los datos: {error.message}
      </div>
    );
  if (!usuario)
    return <div className="text-center p-10">No se encontró el usuario.</div>;

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Editar Usuario</h1>

      {submitError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput
              label="Username"
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}
