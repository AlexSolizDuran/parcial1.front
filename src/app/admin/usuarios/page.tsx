"use client";
import useSWR from "swr";
import { Usuario } from "@/types/usuarios/usuarios";
import CardUser from "@/components/cards/CardUser";

// fetcher para SWR

const fetcher = async (url: string) => {
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
};

export default function ListaUsuarios() {
  const url = process.env.NEXT_PUBLIC_API_URL;

  const { data, error, isLoading } = useSWR<Usuario[]>(
    `${url}/usuario/usuarios/`,
    fetcher
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
    
    <div> esta sera algo general para despues</div>
  );
}
