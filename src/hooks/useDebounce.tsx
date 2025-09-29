// src/hooks/useDebounce.ts

import { useState, useEffect } from 'react';

/**
 * Hook para retrasar la actualización de un valor. 
 * Útil para reducir la cantidad de solicitudes a la API mientras el usuario escribe.
 * * @param value El valor a retrasar (ej., el término de búsqueda).
 * @param delay El tiempo de retraso en milisegundos (ej., 500ms).
 * @returns El valor final retrasado.
 */
export default function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Establecer un temporizador que actualiza el valor retrasado
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Limpieza: cancelar el temporizador si el valor (value) cambia antes del retraso
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}