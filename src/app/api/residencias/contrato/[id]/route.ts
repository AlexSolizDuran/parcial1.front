// src/app/api/usuarios/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get("sessionToken")?.value;
  const { id } = await params
  if (!token)
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const res = await fetch(
    `${process.env.API_URL}/residencias/contrato/${id}/`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// src/app/api/usuarios/[id]/route.ts

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params
  const token = request.cookies.get("sessionToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.formData();

    const res = await fetch(
      `${process.env.API_URL}/residencias/contrato/${id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Error en PATCH /api/usuarios/[id]:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params
  const token = request.cookies.get("sessionToken")?.value;
  if (!token)
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const res = await fetch(
    `${process.env.API_URL}/residencias/contrato/${id}/`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (res.status === 204) {
    return NextResponse.json(
      { success: true, message: "contrato eliminada" },
      { status: 200 }
    );
  }
  // DELETE a veces no devuelve JSON, cuidamos eso:
  let data = {};
  try {
    data = await res.json();
  } catch {}

  return NextResponse.json(data, { status: res.status });
}
