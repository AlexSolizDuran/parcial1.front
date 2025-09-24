"use client";

import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Home, Settings, User } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  
  const menuItems = [
    { name: "Inicio", icon: <Home size={20} />, href: "/" },
    { name: "Perfil", icon: <User size={20} />, href: "/perfil" },
    {
      name: "Configuración",
      icon: <Settings size={20} />,
      href: "/configuracion",
    },
    {
      name: "Configuración1",
      icon: <Settings size={20} />,
      href: "/configuracion",
    },
    {
      name: "Configuración2",
      icon: <Settings size={20} />,
      href: "/configuracion",
    },
    {
      name: "Configuración3",
      icon: <Settings size={20} />,
      href: "/configuracion",
    },
    {
      name: "Configuración4",
      icon: <Settings size={20} />,
      href: "/configuracion",
    },
    {
      name: "Configuración5",
      icon: <Settings size={20} />,
      href: "/configuracion",
    },
    {
      name: "Configuración6",
      icon: <Settings size={20} />,
      href: "/configuracion",
    },
  ];
  

  return (
    <div className="flex">
      <button
        onClick={() => setOpen(true)}
        className="p-2 md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white rounded-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar móvil */}
      {open && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed top-0 left-0 z-50 w-64 h-screen bg-blue-400 overflow-auto"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Mi App</h2>
            <button onClick={() => setOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item, i) => (
              <a key={i} href={item.href} className="block p-2 hover:bg-gray-700 rounded">
                {item.name}
              </a>
            ))}
          </nav>
        </motion.aside>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 h-screen bg-green-400 overflow-auto relative">
        <div className="p-4 border-b border-gray-700 font-bold text-xl">Mi App</div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item, i) => (
            <a key={i} href={item.href} className="block p-2 hover:bg-gray-700 rounded">
              {item.name}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}
