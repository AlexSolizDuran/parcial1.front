"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string; // obligatorio si es un botón-link
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export default function Button1({
  children,
  href,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "text-white bg-blue-900 hover:text-white focus:text-white  ",
    secondary:
      "text-blue-900 bg-white  hover:bg-[#FF9800] hover:text-blue-900 focus:ring-blue-900 ",
    
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} w-min sm:w-auto`}
      {...props}
    >
      {children}
    </Link>
  );
}
