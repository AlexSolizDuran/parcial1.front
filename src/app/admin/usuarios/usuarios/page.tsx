"use client";
import useSWR from "swr";
import { Usuario } from "@/types/usuarios";
import CardUser from "@/components/cards/CardUser";
import { apiFetcher } from "@/fetcher";

// fetcher para SWR

/*const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token guardado, inicia sesión");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // si no es 200 → lanzo error con info
  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const errData = await res.json();
      errorMsg = errData.detail || errorMsg;
    } catch {
      // si no es JSON, no pasa nada
    }
    throw new Error(errorMsg);
  }

  return res.json();
};*/

export default function ListaUsuarios() {
  const url = process.env.NEXT_PUBLIC_API_URL;

  const { data, error, isLoading } = useSWR<Usuario[]>(
    `${url}/usuario/usuarios/`,
    apiFetcher
  );

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error al cargar usuarios: {error.message}
      </div>
    );
  }

  if (isLoading) return <div className="p-4">Cargando usuarios...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900 ">
          Gestión de Usuarios
        </h1>
        <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm">
          + Añadir Usuario
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {data?.map((usuario) => (
          <CardUser
            key={usuario.id}
            usuario={usuario}
            
          />
        ))}
      </div>
      {data?.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron usuarios registrados.
          </p>
        </div>
      )}
    </div>
  );
}
