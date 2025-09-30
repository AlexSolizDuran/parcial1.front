'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { apiFetcher } from '@/fetcher';
import { PaginatedResponse } from '@/types/paginacion/paginacion';
import { ExpensaSet, TipoExpensaGet } from '@/types/pagos/expensa';



const CreateExpensaPage: React.FC = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const expensaUrl = `${url}/pago/expensa/`;
  const router = useRouter();
  
  const { data: tiposExpensaData } = useSWR<PaginatedResponse<TipoExpensaGet>>(`${url}/pago/tipo_expensa/`, apiFetcher);

  const [expensa, setExpensa] = useState<ExpensaSet>({
    tipo_expensa: '',
    monto: '',
    fecha_vencimiento: '',
    estado: 'false', // Por defecto 'Pendiente'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setExpensa((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiFetcher(expensaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...expensa,
          monto: expensa.monto,
          estado: expensa.estado === 'true', // Convertir a boolean
        }),
      });

      alert('Expensa creada exitosamente');
      router.push('/admin/cobros/expensas');
    } catch (err: any) {
      setError(err.message || 'Error al crear la expensa.');
      console.error('Error al crear la expensa:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">
        💸 Crear Nueva Expensa
      </h1>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Tipo de Expensa"
            name="tipo_expensa"
            value={expensa.tipo_expensa}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecciona un tipo</option>
            {tiposExpensaData?.results.map(tipo => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </SelectField>

          <InputField
            label="Monto"
            name="monto"
            type="number"
            value={expensa.monto}
            onChange={handleChange}
            placeholder="Ej: 150.50"
            required
          />

          <InputField
            label="Fecha de Vencimiento"
            name="fecha_vencimiento"
            type="date"
            value={expensa.fecha_vencimiento}
            onChange={handleChange}
            required
          />

          <SelectField
            label="Estado"
            name="estado"
            value={expensa.estado}
            onChange={handleChange}
            required
          >
            <option value="false">Pendiente</option>
            <option value="true">Pagado</option>
          </SelectField>
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
            {isLoading ? 'Guardando Expensa...' : 'Guardar Expensa'}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Componentes de Ayuda para el Formulario (Reutilizados) ---

interface FieldProps { label: string; name: string; required?: boolean; }
interface InputFieldProps extends FieldProps { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type: string; placeholder?: string; }
const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type, placeholder, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
  </div>
);

interface SelectFieldProps extends FieldProps { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; }
const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, required, children }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select id={name} name={name} value={value} onChange={onChange} required={required} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150">{children}</select>
  </div>
);

interface TextareaFieldProps extends FieldProps { value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; }
const TextareaField: React.FC<TextareaFieldProps> = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
  </div>
);

export default CreateExpensaPage;