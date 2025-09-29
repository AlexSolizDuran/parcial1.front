"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
    href: string; // obligatorio si es un botón-link
    variant?: "create" | "delete" | "update" | "show";
    size?: "sm" | "md" | "lg";
}

export default function Button2({
    children,
    href,
    variant = "create",
    size = "md",
    ...props
}: ButtonProps) {
    const baseClasses =
        "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
        create:
            "text-white bg-green-600 hover:text-black ",
        update:
            "text-white bg-blue-600",
        delete:
            "text-white bg-red-600",
        show:
            "text-white bg-blue-900"

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
