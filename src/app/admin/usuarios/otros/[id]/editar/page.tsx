"use client";
import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { apiFetcher } from "@/fetcher";
import { Persona } from "@/types/usuarios";
import FormInput from "@/components/input/FormInput";
import FormSelect from "@/components/input/FormSelect";

interface PersonaEditProps {
  params: Promise<{ id: string }>;
}

export default function PersonaEdit({ params }: PersonaEditProps) {
  const router = useRouter();
  const { id } = use(params);
  const url = process.env.NEXT_PUBLIC_API_URL;
  const personaUrl = `${url}/usuario/personas/${id}/`;
  const listUrl = `${url}/usuario/personas/`;

  const {
    data: persona,
    error,
    isLoading,
  } = useSWR<Persona>(personaUrl, apiFetcher);

  const [formData, setFormData] = useState<Partial<Persona>>({});
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cuando se carga la persona, inicializamos el formulario
  React.useEffect(() => {
    if (persona) {
      setFormData({
        nombre: persona.nombre,
        apellido: persona.apellido,
        ci: persona.ci,
        telefono: persona.telefono,
        fecha_nacimiento: persona.fecha_nacimiento,
        genero: persona.genero,
        direccion: persona.direccion,
      });
    }
  }, [persona]);

  if (isLoading)
    return <div className="text-center p-10">Cargando datos...</div>;
  if (error)
    return (
      <div className="text-center p-10 text-red-500">
        Error al cargar los datos: {error.message}
      </div>
    );
  if (!persona)
    return <div className="text-center p-10">No se encontró la persona.</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        if (value !== undefined && value !== null)
          dataToSend.append(key, String(value));
      });

      if (fotoFile) {
        dataToSend.append("foto", fotoFile);
      }

      const response = await apiFetcher<Persona>(personaUrl, {
        method: "PATCH",
        body: dataToSend,
      });

      // Actualiza cache de SWR
      mutate(listUrl);
      mutate(personaUrl);

      // Redirige al detalle de la persona
      router.push(`/admin/usuarios/otros/${id}`);
    } catch (err: any) {
      setSubmitError(err.message || "Ocurrió un error al actualizar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex-shrink-0 w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white shadow-md">
        {persona.foto ? (
          <img
            src={persona.foto}
            alt={`Foto de ${persona.nombre}`}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-white">
            {persona.nombre.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Editar Persona</h1>

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
            label="Nombre"
            type="text"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Apellido"
            type="text"
            name="apellido"
            value={formData.apellido || ""}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Cédula de Identidad"
            type="text"
            name="ci"
            value={formData.ci || ""}
            numericOnly
            onChange={handleChange}
            required
          />
          <FormInput
            label="Teléfono"
            type="text"
            name="telefono"
            value={formData.telefono || ""}
            numericOnly
            onChange={handleChange}
            required
          />
          <FormInput
            label="Fecha de Nacimiento"
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento || ""}
            onChange={handleChange}
            required
          />
          <FormSelect
            label="Género"
            name="genero"
            value={formData.genero || ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="N">No especificado</option>
          </FormSelect>
          <FormInput
            label="Dirección"
            type="text"
            name="direccion"
            value={formData.direccion || ""}
            onChange={handleChange}
            required
            containerClassName="sm:col-span-2"
          />

          <FormInput
            label="Foto (Opcional)"
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            containerClassName="sm:col-span-2"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar Persona"}
          </button>
        </div>
      </form>
    </div>
  );
}
