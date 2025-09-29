"use client"

import Button1 from "@/components/buttons/Button1";
import { usePathname } from "next/navigation";
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
          href="/admin/residencias/viviendas"
          size="sm"
          variant={pathname === "/admin/residencias/viviendas" ? "primary" : "secondary"}
        >
          Viviendas
        </Button1>
        <Button1
          href="/admin/residencias/contratos"
          size="sm"
          variant={pathname === "/admin/residencias/contratos" ? "primary" : "secondary"}
        >
          Contratos
        </Button1>
        
      </div>

      {/* El contenido de la página (children) se renderiza aquí */}
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}


