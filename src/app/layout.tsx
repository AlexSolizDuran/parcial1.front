import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" flex">
        <aside className="">
          <Sidebar></Sidebar>
        </aside>

        <main className="bg-black w-screen">{children}</main>
      </body>
    </html>
  );
}
