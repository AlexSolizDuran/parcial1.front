"use client"

import { apiFetcher } from "@/fetcher";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";
import React from 'react';
import { ViviendaGet, ViviendaSet } from "@/types/residencias/vivienda";


export default function EditHome({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const viviendaUrl = `/api/residencias/vivienda/${id}/`; // URL específica de la vivienda
    const listUrl = `/api/residencias/vivienda/`; // URL de la lista de viviendas


    // 1. Cargar datos existentes con SWR
    const { data: initialData, error: fetchError, isLoading: isFetching } = useSWR<ViviendaGet>(viviendaUrl, apiFetcher);

    // 2. Estado del formulario
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [viviendaForm, setViviendaForm] = useState<ViviendaSet>({
        nro_vivienda: "",
        precio_alquiler: "",
        precio_anticretico: "",
        superficie: "",
        estado: false,
        
    });

    // 3. Efecto para inicializar el formulario cuando los datos cargan
    useEffect(() => {
        if (initialData) {
            setViviendaForm({
                nro_vivienda: initialData.nro_vivienda,
                precio_alquiler: initialData.precio_alquiler,
                precio_anticretico: initialData.precio_anticretico,
                superficie: initialData.superficie, // Mapeamos 'superficie' del GET a 'superfice' del formulario
                estado: initialData.estado,
            });
        }
    }, [initialData]);

    // --- Manejo de la carga y errores de la petición GET ---

    if (isFetching) {
        return (
            <div className="flex justify-center p-8 text-lg font-medium text-gray-500">
                Cargando datos de la vivienda... 🔄
            </div>
        );
    }

    if (fetchError || !initialData) {
        return (
            <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-md m-4">
                Error al cargar los detalles para edición. ID: {id}.
            </div>
        );
    }

    // --- Manejadores de Eventos ---

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "estado") {
            // Solo 'Disponible' (el string) se convierte a true.
            // 'Ocupada' y 'Reservada' se convierten a false.
            const boolValue = value === "Disponible";

            setViviendaForm((prev) => ({ ...prev, [name]: boolValue }));
        }
        // ... (Tu lógica para 'foto' y otros campos va aquí)
        else {
            setViviendaForm((prev) => ({ ...prev, [name]: value }));
        }

        if (name === "foto" && e.target instanceof HTMLInputElement && e.target.files) {
            setFotoFile(e.target.files[0] || null);
        } else {
            setViviendaForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Usamos FormData porque estamos enviando un archivo (fotoFile)
        const dataToSend = new FormData();

        // Adjuntamos todos los campos del formulario
        Object.entries(viviendaForm).forEach(([key, value]) => {
            dataToSend.append(key, String(value));
        });

        // Adjuntamos el nuevo archivo de foto si existe
        if (fotoFile) {
            dataToSend.append("foto", fotoFile);
        } else {
            // Si el backend lo requiere, puedes enviar una señal para no cambiar la foto
            // Si solo envías el archivo cuando existe (como está arriba), generalmente basta para PATCH.
        }

        try {
            // Realizar la petición PATCH
            await apiFetcher(viviendaUrl, {
                method: "PATCH", // <--- MÉTODO CLAVE PARA LA EDICIÓN PARCIAL
                body: dataToSend,
            });

            // Invalidar el caché de SWR para la URL de la vivienda y la lista general
            mutate(viviendaUrl);
            mutate(listUrl); // Asume que esta es la URL de la lista

            router.push(`/admin/residencias/viviendas/${id}?updated=true`); // Redirigir a la vista de detalles
        } catch (err: any) {
            console.error("Error en la edición:", err);
            setError(err.message || "Error al actualizar la vivienda. Revisa los datos.");
        } finally {
            setIsLoading(false);
        }
    }

    // --- Renderizado del Formulario ---

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
            <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-2">
                ✏️ Editar Vivienda #{initialData.nro_vivienda}
            </h1>

            {error && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Visualización de la foto actual */}
                <CurrentPhotoSection initialPhoto={initialData.foto} fotoFile={fotoFile} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Número de Vivienda */}
                    <InputField
                        label="Número de Vivienda"
                        name="nro_vivienda"
                        value={viviendaForm.nro_vivienda}
                        onChange={handleChange}
                        type="text"
                        required
                    />

                    {/* Superficie */}
                    <InputField
                        label="Superficie (m²)"
                        name="superficie"
                        value={viviendaForm.superficie}
                        onChange={handleChange}
                        type="number"
                        placeholder="Ej: 85.5"
                        required
                    />

                    {/* Precio Alquiler */}
                    <InputField
                        label="Precio de Alquiler ($)"
                        name="precio_alquiler"
                        value={viviendaForm.precio_alquiler}
                        onChange={handleChange}
                        type="number"
                        placeholder="Ej: 300"
                    />

                    {/* Precio Anticrético */}
                    <InputField
                        label="Precio de Anticrético ($)"
                        name="precio_anticretico"
                        value={viviendaForm.precio_anticretico}
                        onChange={handleChange}
                        type="number"
                        placeholder="Ej: 30000"
                    />
                </div>

                {/* Estado y Foto (Full Width) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Estado (Selector) */}
                    

                    {/* Subir Nueva Foto */}
                    <div>
                        <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">
                            Subir Nueva Foto (Opcional)
                        </label>
                        <input
                            id="foto"
                            name="foto"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-50 file:text-green-700
                                hover:file:bg-green-100"
                        />
                        {fotoFile && (
                            <p className="mt-1 text-xs text-green-600">
                                Nuevo archivo a subir: {fotoFile.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Botón de Submit */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition duration-300 ${isLoading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                    >
                        {isLoading ? 'Actualizando Vivienda...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// --- Componente de Ayuda: InputField ---

interface InputFieldProps {
    label: string;
    name: keyof ViviendaSet;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type: string;
    placeholder?: string;
    required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    value,
    onChange,
    type,
    placeholder,
    required
}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
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
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
    </div>
);

// --- Componente para mostrar la imagen actual (Usando <img> para evitar conflictos) ---

interface CurrentPhotoSectionProps {
    initialPhoto?: string;
    fotoFile: File | null;
}

const CurrentPhotoSection: React.FC<CurrentPhotoSectionProps> = ({ initialPhoto, fotoFile }) => {
    // Si hay un nuevo archivo seleccionado, muestra la previsualización del nuevo archivo
    const previewUrl = fotoFile ? URL.createObjectURL(fotoFile) : initialPhoto;

    // Si se sube una foto, la etiqueta <img> la reemplazará
    useEffect(() => {
        return () => {
            if (fotoFile) URL.revokeObjectURL(previewUrl as string);
        };
    }, [fotoFile, previewUrl]);

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Foto Actual</h3>
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                {previewUrl ? (
                    // Usando <img> nativo como solicitaste
                    <img
                        src={previewUrl}
                        alt="Foto actual de la vivienda"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className="absolute inset-0"
                    />
                ) : (
                    <div className="flex justify-center items-center h-full text-gray-400 text-sm">

                        No hay foto disponible
                    </div>
                )}
            </div>
            {initialPhoto && !fotoFile && (
                <p className="mt-2 text-xs text-gray-500">
                    Sube un nuevo archivo para reemplazar la foto actual.
                </p>
            )}
        </div>
    );
};