"use client";

import { useState } from "react";
import { mutate } from "swr";
import { apiFetcher } from "@/fetcher";
import { Persona } from "@/types/usuarios/usuarios";
import { useRouter } from "next/navigation";
import FormInput from "@/components/input/FormInput";
import FormSelect from "@/components/input/FormSelect";

export default function PersonaCreateView() {
  const router = useRouter();
  const url = `/api/usuari/persona/`;

  const [formData, setFormData] = useState<Persona>({
    nombre: "",
    apellido: "",
    ci: "",
    telefono: " ",
    fecha_nacimiento: "",
    genero: "",
    direccion: "",
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

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
    setError("");
    setIsLoading(true);

    try {
      const dataToSend = new FormData();
      // Agregamos todos los campos de texto al FormData
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });

      // Si hay un archivo de foto, lo agregamos también
      if (fotoFile) {
        dataToSend.append("foto", fotoFile);
      }

      await apiFetcher(url, {
        method: "POST",
        body: dataToSend,
      });
      mutate(url); 
      router.push("/admin/usuarios/otros?created=true");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al crear la persona");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Registrar Nueva Persona
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete los campos para añadir una nueva persona al sistema.
        </p>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormInput
            label="Nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Apellido"
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Cédula de Identidad"
            type="text"
            name="ci"
            value={formData.ci}
            numericOnly
            onChange={handleChange}
            required
          />
          <FormInput
            label="Teléfono"
            type="text"
            name="telefono"
            value={formData.telefono}
            numericOnly
            onChange={handleChange}
            required
          />
          <FormInput
            label="Fecha de Nacimiento"
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
          />
          <FormSelect
            label="Género"
            name="genero"
            value={formData.genero}
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
            value={formData.direccion}
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

        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creando...
              </>
            ) : (
              "Crear Persona"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
