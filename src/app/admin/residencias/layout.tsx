import Sidebar from "@/components/Sidebar";
import Button1 from "@/components/buttons/Button1";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className="flex-col min-h-screen bg-gray-100">
      <div className=" flex-row">
        <Button1 href="/admin/residencias/inquilinos" size="sm" variant="secondary"> Inquilinos</Button1>
        <Button1 href="/admin/residencias/ocupantes" size="sm" variant="secondary"> Ocupantes</Button1>
        <Button1 href="/admin/residencias/viviendas" size="sm" variant="secondary"> Viviendas</Button1>
        <Button1 href="/admin/residencias/propietarios" size="sm" variant="secondary"> Propietarios</Button1>
        </div>
      <section className="flex-1 p-4 md:p-6 w-full">
        {children}
      </section>
    </div>
  );
}


