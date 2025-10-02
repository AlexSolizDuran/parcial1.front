// src/app/api/usuarios/route.ts (Next 13 app router)
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  try {

    // 1️⃣ Leer la cookie HttpOnly donde guardaste el access token
    const token = request.cookies.get("sessionToken")?.value;


    if (!token) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    // 2️⃣ Obtener query params de la URL (ej: ?page=1)
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    // 3️⃣ Hacer la petición al backend Django con el token
    const backendUrl = `${process.env.API_URL}/usuario/usuarios/?page=${page}`;
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    // 4️⃣ Retornar la respuesta al frontend
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error en API route /api/usuarios:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}



// POST -> crear usuario
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("sessionToken")?.value;
    if (!token) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    const body = await request.json();

    const res = await fetch(`${process.env.API_URL}/usuario/usuarios/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error POST usuarios:", err);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}