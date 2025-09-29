"use client";

import { useState } from "react";
import { mutate } from "swr";
import { apiFetcher } from "@/fetcher";
import { Persona, Usuario } from "@/types/usuarios/usuarios";
import { useRouter } from "next/navigation";
import FormInput from "@/components/input/FormInput";
import FormSelect from "@/components/input/FormSelect";
import { Inquilino } from "@/types/usuarios/inquilino";

export default function PersonaCreateView() {
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_API_URL + "/residencias/inquilino/";

    const [personaData, setPersonaData] = useState<Persona>({
        nombre: "",
        apellido: "",
        ci: "",
        telefono: " ",
        fecha_nacimiento: "",
        genero: "",
        direccion: "",
    });
    const [usuarioData, setUsuarioData] = useState<Usuario>({
        username: "",
        password: "",
        email: "",
        persona: personaData,
    });
    const [inquilinoData, setInquilinoData] = useState<Inquilino>({
        usuario: usuarioData,
    });

    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [qrFile, setQrFile] = useState<File | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (e.target instanceof HTMLInputElement && e.target.files) {
            setFotoFile(e.target.files[0] || null);
            setQrFile(e.target.files[0] || null);
        } else {
            setPersonaData((prev) => ({ ...prev, [name]: value }));
            setUsuarioData((prev) => ({ ...prev, [name]: value }));
            setInquilinoData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
      
        try {
          // --- Construir persona ---
          const personaPayload = {
            nombre: personaData.nombre,
            apellido: personaData.apellido,
            ci: personaData.ci,
            telefono: personaData.telefono,
            fecha_nacimiento: personaData.fecha_nacimiento,
            genero: personaData.genero,
            direccion: personaData.direccion,
          };
      
          // --- Payload final ---
          const payload = {
            usuario: {
              username: usuarioData.username,
              password: usuarioData.password ?? "123456",
              email: usuarioData.email,
              persona: personaPayload,
            },
          };
          // --- Enviar al backend ---
          await apiFetcher(url, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          mutate(url); // refresca la cache de SWR
          router.push("/admin/usuarios/inquilinos?created=true");
      
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Error al crear el Inquilino");
        } finally {
          setIsLoading(false);
        }
      };
      
      

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Registrar Nuevo Inquilino
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Complete los campos para añadir un nuevo Inquilino al sistema.
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
                        value={personaData.nombre}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Apellido"
                        type="text"
                        name="apellido"
                        value={personaData.apellido}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Cédula de Identidad"
                        type="text"
                        name="ci"
                        value={personaData.ci}
                        numericOnly
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Teléfono"
                        type="text"
                        name="telefono"
                        value={personaData.telefono}
                        numericOnly
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Fecha de Nacimiento"
                        type="date"
                        name="fecha_nacimiento"
                        value={personaData.fecha_nacimiento}
                        onChange={handleChange}
                        required
                    />
                    <FormSelect
                        label="Género"
                        name="genero"
                        value={personaData.genero}
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
                        value={personaData.direccion}
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
                    <FormInput
                        label="Nombre de Usuario"
                        type="text"
                        name="username"
                        value={usuarioData.username}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Correo Electronico"
                        type="email"
                        name="email"
                        value={usuarioData.email}
                        onChange={handleChange}
                        required
                    />

                    <FormInput
                        label="Contraseña"
                        type="string"
                        name="password"
                        value={usuarioData.password}
                        onChange={handleChange}
                        required
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
