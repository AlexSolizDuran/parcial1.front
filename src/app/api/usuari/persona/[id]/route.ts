import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get("sessionToken")?.value;
  if (!token) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const res = await fetch(`${process.env.API_URL}/usuario/personas/${params.id}/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}



export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get("sessionToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const res = await fetch(
      `${process.env.API_URL}/usuario/personas/${params.id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Error en PATCH /api/personas/[id]:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get("sessionToken")?.value;
  if (!token)
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const res = await fetch(`${process.env.API_URL}/usuario/personas/${params.id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  // DELETE puede devolver 204 (sin body)
  if (res.status === 204) {
    return NextResponse.json(
      { success: true, message: "Persona eliminada" },
      { status: 200 }
    );
  }

  // Si el backend devuelve algo en el body
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  return NextResponse.json(data, { status: res.status });
}

