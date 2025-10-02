'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { apiFetcher } from '@/fetcher';
import { Inquilino } from '@/types/usuarios/inquilino';
import { ViviendaGet } from '@/types/residencias/vivienda';
import { PaginatedResponse } from '@/types/paginacion/paginacion';
import { ContratoSet } from '@/types/residencias/contrato';
import { Persona } from '@/types/usuarios/usuarios';


interface ContratoFormData extends ContratoSet {
  ocupantes: string[]; // Array de CIs de los ocupantes
}


const CreateContratoPage: React.FC = () => {
  const contratoUrl = '/api/residencias/contrato/';
  const router = useRouter();

 
  const { data: inquilinosData } = useSWR<PaginatedResponse<Inquilino>>(`/api/usuari/inquilino/`, apiFetcher);
  const { data: viviendasData } = useSWR<PaginatedResponse<ViviendaGet>>(`/api/residencias/vivienda/`, apiFetcher);
  const { data: personasData } = useSWR<PaginatedResponse<Persona>>(`/api/usuari/persona/`, apiFetcher);

  const [contrato, setContrato] = useState<ContratoFormData>({
    inquilino: '',
    vivienda: '',
    fecha_ingreso: '',
    fecha_salida: '',
    porcentaje_expensa: '',
    tipo_renta:'',
    descripcion: '',
    ocupantes: [],
  });

  // Estado para el ocupante seleccionado en el dropdown
  const [ocupanteSeleccionado, setOcupanteSeleccionado] = useState('');
  // Estado para la carga y errores del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => { 
    const { name, value } = e.target;
    setContrato((prevcontrato) => ({
      ...prevcontrato,
      [name]: value,
    }));
  };

  const handleAnadirOcupante = () => {
    if (ocupanteSeleccionado && !contrato.ocupantes.includes(ocupanteSeleccionado)) {
      setContrato(prev => ({
        ...prev,
        ocupantes: [...prev.ocupantes, ocupanteSeleccionado]
      }));
      setOcupanteSeleccionado(''); // Reset dropdown
    }
  };

  const handleEliminarOcupante = (ciToRemove: string) => {
    setContrato(prev => ({
      ...prev,
      ocupantes: prev.ocupantes.filter(ci => ci !== ciToRemove)
    }));
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Prepara el payload para la API, incluyendo los ocupantes
    const payload = {
      inquilino: contrato.inquilino,
      vivienda: contrato.vivienda,
      fecha_ingreso: contrato.fecha_ingreso,
      fecha_salida: contrato.fecha_salida,
      porcentaje_expensa: contrato.porcentaje_expensa,
      tipo_renta: contrato.tipo_renta,
      descripcion: contrato.descripcion,
      ocupantes_ci: contrato.ocupantes, // Asumiendo que el backend espera este campo
    };

    try {
      await apiFetcher(contratoUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      alert('Contrato creado exitosamente');
      router.push('/admin/residencias/contratos/'); 
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
            label="Seleccionar Inquilino"
            name="inquilino"
            value={contrato.inquilino}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecciona un inquilino</option>
            {inquilinosData?.results.map(inquilino => (
              <option key={inquilino.id} value={inquilino.id}>
                {inquilino.usuario_detail?.persona.nombre} {inquilino.usuario_detail?.persona.apellido}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Seleccionar Vivienda"
            name="vivienda"
            value={contrato.vivienda}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecciona una vivienda</option>
            {viviendasData?.results.map(vivienda => (
              <option key={vivienda.id} value={vivienda.id}>Vivienda Nro. {vivienda.nro_vivienda}</option>
            ))}
          </SelectField>

          <InputField
            label="Fecha de Inicio del Contrato"
            name="fecha_ingreso"
            type="date"
            value={contrato.fecha_ingreso}
            onChange={handleChange}
            required
          />

          <InputField
            label="Fecha de Finalización del Contrato"
            name="fecha_salida"
            type="date"
            value={contrato.fecha_salida}
            onChange={handleChange}
            required
          />

          <InputField
            label="Porcentaje Expensa (%)"
            name="porcentaje_expensa"
            type="number"
            value={String(contrato.porcentaje_expensa)}
            onChange={handleChange}
            placeholder="Ej: 5"
            required
          />
          <SelectField
            label="Seleccionar Tipo de Renta"
            name="tipo_renta"
            value={contrato.tipo_renta}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecciona un Tipo de Renta</option>
              <option value="anticretico" >Anticrético</option>
              <option value="alquiler" >Alquiler</option>
          </SelectField>
        </div>

        <TextareaField
          label="Descripción del Contrato (Términos y Condiciones)"
          name="descripcion"
          value={contrato.descripcion}
          onChange={handleChange}
          placeholder="Detalles del contrato, cláusulas, etc."
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ocupantes Adicionales</label>
          <div className="flex gap-2 items-center">
            <select
              value={ocupanteSeleccionado}
              onChange={(e) => setOcupanteSeleccionado(e.target.value)}
              className="flex-grow w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="" disabled>Selecciona una persona</option>
              {personasData?.results.map(persona => (
                <option key={persona.id} value={persona.ci}>
                  {persona.nombre} {persona.apellido} (CI: {persona.ci})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAnadirOcupante}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-150"
            >
              Añadir
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {contrato.ocupantes.map((ci) => {
              const persona = personasData?.results.find(p => p.ci === ci);
              return (
                <li key={ci} className="flex justify-between items-center bg-gray-50 p-2 rounded-md border">
                  <span>{persona ? `${persona.nombre} ${persona.apellido}` : `CI: ${ci}`}</span>
                  <button
                    type="button"
                    onClick={() => handleEliminarOcupante(ci)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition duration-150"
                  >
                    Eliminar
                  </button>
                </li>
              );
            })}
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

interface Fieldviviendas {
  label: string;
  name: string;
  required?: boolean;
}

interface InputFieldviviendas extends Fieldviviendas {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldviviendas> = ({ label, name, value, onChange, type, placeholder, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
  </div>
);

interface SelectFieldviviendas extends Fieldviviendas {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

const SelectField: React.FC<SelectFieldviviendas> = ({ label, name, value, onChange, required, children }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select id={name} name={name} value={value} onChange={onChange} required={required}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150">
      {children}
    </select>
  </div>
);

interface TextareaFieldviviendas extends Fieldviviendas {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const TextareaField: React.FC<TextareaFieldviviendas> = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={4}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
  </div>
);

export default CreateContratoPage;