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
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      let errorMsg = `Error ${res.status}`;
      try {
        const errData = await res.json();
        errorMsg = errData.detail || errData.message || JSON.stringify(errData) || errorMsg;
      } catch {
        // si no es JSON, ignoramos
      }

      // Depuración extra: mostrar todo lo que se envió
      console.error("----- API Fetcher Debug -----");
      console.error("URL:", url);
      console.error("Method:", options.method ?? "GET");
      console.error("Headers:", headers);
      if (options.body) {
        if (isFormData) {
          console.error("Body (FormData):");
          for (let [key, value] of (options.body as FormData).entries()) {
            if (value instanceof File) console.error(key, value.name);
            else console.error(key, value);
          }
        } else {
          console.error("Body (JSON):", options.body);
        }
      }
      console.error("-----------------------------");

      throw new Error(errorMsg);
    }

    if (res.status === 204) return {} as T;

    return res.json() as Promise<T>;
  } catch (err: any) {
    console.error("API Fetcher caught an error:", err);
    throw err;
  }
};
