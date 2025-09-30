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
      
      <div className="flex flex-wrap md:justify-center justify-start items-center gap-2 p-4 bg-white border-b border-gray-200 shadow-sm">
        <Button1
          href="/admin/cobros/expensas"
          size="sm"
          variant={pathname === "/admin/cobros/expensas" ? "primary" : "secondary"}
        >
          Expensas
        </Button1>
        <Button1
          href="/admin/cobros/multas"
          size="sm"
          variant={pathname === "/admin/cobros/multas" ? "primary" : "secondary"}
        >
          Multas
        </Button1>
        <Button1
          href="/admin/cobros/servicios_basicos"
          size="sm"
          variant={pathname === "/admin/cobros/servicios_basicos" ? "primary" : "secondary"}
        >
          Servicios Basicos
        </Button1>
      </div>

      {/* El contenido de la página (children) se renderiza aquí */}
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}
