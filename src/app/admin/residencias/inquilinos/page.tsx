"use client"; // Importante para usar hooks y fetch en el cliente
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const url = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("token")
  useEffect(() => {
   

    fetch(`${url}/usuario/login/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Esta es la vista del inquilino</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
