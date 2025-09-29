'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { apiFetcher } from '@/fetcher';
import { Inquilino } from '@/types/usuarios/inquilino';
import { ViviendaGet } from '@/types/residencias/vivienda';
import { PaginatedResponse } from '@/types/paginacion/paginacion';

/**
 * Interfaz para definir la estructura de los datos del contrato de vivienda.
 */
interface ContractData {
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  amount: number | string;
  occupants: string[];
  terms: string;
}

/**
 * Vista para crear un nuevo contrato de alquiler de vivienda.
 * Contiene un formulario para ingresar los detalles del contrato,
 * seleccionar inquilino, vivienda y añadir ocupantes.
 */
const CreateContractPage: React.FC = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // Carga de datos desde la API
  const { data: tenantsData } = useSWR<PaginatedResponse<Inquilino>>(`${url}/residencias/inquilino/`, apiFetcher);
  const { data: propertiesData } = useSWR<PaginatedResponse<ViviendaGet>>(`${url}/residencias/vivienda/`, apiFetcher);

  const [contract, setContract] = useState<ContractData>({
    tenantId: '',
    propertyId: '',
    startDate: '',
    endDate: '',
    amount: '',
    occupants: [],
    terms: '',
  });

  // Estado para el campo de texto del nuevo ocupante
  const [currentOccupant, setCurrentOccupant] = useState('');
  // Estado para la carga y errores del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Maneja los cambios en los campos del formulario y actualiza el estado.
   * @param e Evento de cambio del input o textarea.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => { 
    const { name, value } = e.target;
    setContract((prevContract) => ({
      ...prevContract,
      [name]: value,
    }));
  };

  /**
   * Añade un nuevo ocupante a la lista de ocupantes del contrato.
   */
  const handleAddOccupant = () => {
    if (currentOccupant.trim() !== '') {
      setContract((prev) => ({
        ...prev,
        occupants: [...prev.occupants, currentOccupant.trim()],
      }));
      setCurrentOccupant(''); // Limpiar el input
    }
  };

  /**
   * Elimina un ocupante de la lista por su índice.
   * @param indexToRemove El índice del ocupante a eliminar.
   */
  const handleRemoveOccupant = (indexToRemove: number) => {
    setContract((prev) => ({
      ...prev,
      occupants: prev.occupants.filter((_, index) => index !== indexToRemove),
    }));
  };

  /**
   * Maneja el envío del formulario.
   * Por ahora, solo muestra los datos en la consola.
   * @param e Evento de envío del formulario.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Usando apiFetcher para la solicitud POST
      await apiFetcher(`${url}/residencias/contrato/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquilino: contract.tenantId,
          vivienda: contract.propertyId,
          fecha_ingreso: contract.startDate,
          fecha_salida: contract.endDate,
          porcentaje_expensa: Number(contract.amount),
          tipo_renta: 'Alquiler',
          descripcion: contract.terms,
        }),
      });

      alert('Contrato creado exitosamente');
      router.push('/admin/residencias/contratos'); // Redirigir a la lista de contratos
    } catch (err: any) {
      setError(err.message);
      console.error('Error en el envío del contrato:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">
        📝 Crear Nuevo Contrato
      </h1>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Inquilino"
            name="tenantId"
            value={contract.tenantId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecciona un inquilino</option>
            {tenantsData?.results.map(tenant => (
              <option key={tenant.id} value={tenant.usuario_detail?.id}>
                {tenant.usuario_detail?.persona.nombre} {tenant.usuario_detail?.persona.apellido}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Vivienda"
            name="propertyId"
            value={contract.propertyId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecciona una vivienda</option>
            {propertiesData?.results.map(prop => (
              <option key={prop.id} value={prop.id}>Vivienda Nro. {prop.nro_vivienda}</option>
            ))}
          </SelectField>

          <InputField
            label="Fecha de Inicio"
            name="startDate"
            type="date"
            value={contract.startDate}
            onChange={handleChange}
            required
          />

          <InputField
            label="Fecha de Finalización"
            name="endDate"
            type="date"
            value={contract.endDate}
            onChange={handleChange}
            required
          />

          <InputField
            label="Porcentaje Expensa (%)"
            name="amount"
            type="number"
            value={String(contract.amount)}
            onChange={handleChange}
            placeholder="Ej: 5"
            required
          />
        </div>

        <TextareaField
          label="Términos y Condiciones (Descripción)"
          name="terms"
          value={contract.terms}
          onChange={handleChange}
          placeholder="Detalles del contrato, cláusulas, etc."
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ocupantes Adicionales</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentOccupant}
              onChange={(e) => setCurrentOccupant(e.target.value)}
              placeholder="Nombre del ocupante"
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddOccupant}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
            >
              Añadir
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {contract.occupants.map((occupant, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md border">
                <span>{occupant}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOccupant(index)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition duration-300 ${isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {isLoading ? 'Guardando Contrato...' : 'Guardar Contrato'}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Componentes de Ayuda para el Formulario ---

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

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type, placeholder, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
  </div>
);

interface SelectFieldProps extends FieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, required, children }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select id={name} name={name} value={value} onChange={onChange} required={required}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150">
      {children}
    </select>
  </div>
);

interface TextareaFieldProps extends FieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={4}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
  </div>
);

export default CreateContractPage;