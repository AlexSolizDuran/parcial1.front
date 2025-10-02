"use client"
import { apiFetcher } from "@/fetcher";
import { ViviendaSet } from "@/types/residencias/vivienda";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { mutate } from "swr";


// --- Componente principal: Formulario de Creación de Vivienda ---

export default function Home() {
    const router = useRouter()
    const viviendaUrl = `/api/residencias/vivienda/`

    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const [viviendaForm, setViviendaForm] = useState<ViviendaSet>({
        nro_vivienda: "",
        precio_alquiler: "",
        precio_anticretico: "",
        superficie: "", // Usando 'superfice' para que coincida con tu estado inicial.
        estado: true,
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Manejo del archivo de foto
        if (name === "foto" && e.target instanceof HTMLInputElement && e.target.files) {
            setFotoFile(e.target.files[0] || null);
        } else {
            // Manejo de los campos de texto y select
            setViviendaForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previene el comportamiento por defecto de recarga del formulario
        setIsLoading(true);
        setError(""); // Limpiar errores previos

        const dataToSend = new FormData();
        Object.entries(viviendaForm).forEach(([key, value]) => {
            // Asegurarse de que todos los valores se conviertan a string si no lo son
            dataToSend.append(key, String(value));
        });

        try {
            if (fotoFile) {
                // El campo del backend que recibe el archivo debe ser 'foto'
                dataToSend.append("foto", fotoFile);
            }

            // Realizar la petición POST
            await apiFetcher(viviendaUrl, {
                method: "POST",
                body: dataToSend,
                // No necesitamos 'Content-Type': 'application/json' porque estamos enviando FormData
            });

            // Invalidar caché de SWR para que la lista de viviendas se actualice
            // El 'url' aquí debería ser la clave de la lista de viviendas (e.g., `${url}/residencias/vivienda`).
            mutate(viviendaUrl);

            // Redirigir y mostrar mensaje de éxito
            router.push("/admin/residencias/viviendas?created=true");
        } catch (err: any) {
            console.error("Error en la creación:", err);
            // Intenta obtener un mensaje de error más específico de la API
            setError(err.message || "Error al crear la vivienda. Por favor, revisa los datos.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">
                🏡 Crear Nueva Vivienda
            </h1>

            {/* Mensaje de Error */}
            {error && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                        name="superficie" // Usando 'superfice'
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
                    <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                            Estado (¿Está Disponible?)
                        </label>
                        <select
                            id="estado"
                            name="estado"
                            // Convertimos el booleano del estado a string para que coincida con el 'value' de las opciones
                            value={viviendaForm.estado.toString()}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        >
                            <option value="" disabled>Seleccione disponibilidad</option>
                            {/* Usamos los strings "true" y "false" como valores */}
                            <option value="true">Disponible</option>
                            <option value="false">Ocupada</option>
                            {/* Nota: Hemos quitado "Reservada" porque un booleano solo maneja dos estados */}
                        </select>
                    </div>

                    {/* Foto */}
                    <div>
                        <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">
                            Foto de la Vivienda
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
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                        {fotoFile && (
                            <p className="mt-1 text-xs text-green-600">
                                Archivo cargado: {fotoFile.name}
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
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                    >
                        {isLoading ? 'Creando Vivienda...' : 'Guardar Nueva Vivienda'}
                    </button>
                </div>
            </form>
        </div>
    )
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
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
        />
    </div>
);