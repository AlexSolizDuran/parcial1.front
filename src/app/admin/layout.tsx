import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
        <Sidebar variant="admin" />
      <section className="flex-1 p-4 md:p-6 w-full ">
        {children}
      </section>
    </div>
  );
}
