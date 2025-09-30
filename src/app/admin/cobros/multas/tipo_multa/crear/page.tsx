"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetcher } from "@/fetcher";
import { TipoMultaSet } from "@/types/pagos/multa";

const CreateTipomultaPage: React.FC = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const tipomultaUrl = `${url}/incidencia/tipo_multa/`;
  const router = useRouter();

  const [tipomulta, setTipomulta] = useState<TipoMultaSet>({
    nombre: "",
    descripcion: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTipomulta((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiFetcher(tipomultaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tipomulta),
      });

      alert("Tipo de multa creado exitosamente");
      router.push("/admin/cobros/multas/tipo_multa/");
    } catch (err: any) {
      setError(err.message || "Error al crear el tipo de multa.");
      console.error("Error al crear el tipo de multa:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">
        🏷️ Crear Nuevo Tipo de Multa
      </h1>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Nombre del Tipo de multa"
          name="nombre"
          type="text"
          value={tipomulta.nombre}
          onChange={handleChange}
          placeholder="Ej: Mantenimiento de Ascensor"
          required
        />

        <TextareaField
          label="Descripción"
          name="descripcion"
          value={tipomulta.descripcion}
          onChange={handleChange}
          placeholder="Detalles sobre este tipo de multa..."
        />

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition duration-300 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isLoading ? "Guardando..." : "Guardar Tipo de multa"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Componentes de Ayuda para el Formulario (Reutilizados) ---

interface FieldProps {
  label: string;
  name: string;
  required?: boolean;
}
interface InputFieldProps extends FieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder?: string;
}
const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type,
  placeholder,
  required,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
    />
  </div>
);

interface TextareaFieldProps extends FieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}
const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={4}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
    />
  </div>
);

export default CreateTipomultaPage;
