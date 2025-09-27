import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const { username, password } = await request.json();

    // 1. Llamamos a tu backend REAL para autenticar al usuario
    const backendResponse = await fetch(
      `${url}/usuario/login/`, // URL del backend actualizada
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!backendResponse.ok) {
      // Si el backend devuelve un error, lo pasamos al frontend
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { message: errorData.message || "Credenciales inválidas" },
        { status: backendResponse.status }
      );
    }

    // 2. El backend nos devuelve el token en el cuerpo de la respuesta
    const data = await backendResponse.json();
    const token = data.access;
    
    if (!token) {
      return NextResponse.json(
        { message: "El token no fue proporcionado por el backend" },
        { status: 500 }
      );
    }

    // 3. Creamos una respuesta y establecemos el token en una cookie httpOnly
    const response = NextResponse.json({
      success: true,
      roles: data.roles,
      username: data.username,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      access: token
    });
    response.cookies.set({
      name: "sessionToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 día de expiración
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
