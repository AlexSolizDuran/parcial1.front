// src/lib/fetcher.ts
export const apiFetcher = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem("token");

  // Detectar si el body es FormData
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }), 
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers, // permite sobreescribir headers
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const errData = await res.json();
      errorMsg = errData.detail || errData.message || errorMsg;
    } catch {
      // si no es JSON, ignoramos
    }
    throw new Error(errorMsg);
  }

  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
};
