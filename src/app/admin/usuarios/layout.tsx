"use client"; 
import { usePathname } from "next/navigation"; 
import Button1 from "@/components/buttons/Button1";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); 

  return (
    <div>
      
      <div className="flex flex-wrap items-center gap-2 p-4 bg-white border-b border-gray-200 shadow-sm">
        <Button1
          href="/admin/usuarios/usuarios"
          size="sm"
          variant={pathname === "/admin/usuarios/usuarios" ? "primary" : "secondary"}
        >
          Todos
        </Button1>
        <Button1
          href="/admin/usuarios/propietarios"
          size="sm"
          variant={pathname === "/admin/usuarios/propietarios" ? "primary" : "secondary"}
        >
          Propietarios
        </Button1>
        <Button1
          href="/admin/usuarios/inquilinos"
          size="sm"
          variant={pathname === "/admin/usuarios/inquilinos" ? "primary" : "secondary"}
        >
          Inquilinos
        </Button1>
        <Button1
          href="/admin/usuarios/seguridad"
          size="sm"
          variant={pathname === "/admin/usuarios/seguridad" ? "primary" : "secondary"}
        >
          Seguridad
        </Button1>
        <Button1
          href="/admin/usuarios/otros"
          size="sm"
          variant={pathname === "/admin/usuarios/otros" ? "primary" : "secondary"}
        >
          Personas
        </Button1>
      </div>

      {/* El contenido de la página (children) se renderiza aquí */}
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}
