"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = "Atrás", className = "" }: BackButtonProps) {
  const router = useRouter();

  return (
    <div className={`flex justify-end gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => router.back()}
        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {label}
      </button>
    </div>
  );
}
