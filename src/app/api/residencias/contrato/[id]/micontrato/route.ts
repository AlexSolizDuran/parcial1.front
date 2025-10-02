import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.cookies.get("sessionToken")?.value;
  if (!token)
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const res = await fetch(
    `${process.env.API_URL}/residencias/contrato/${id}/micontrato/`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
