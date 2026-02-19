const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function getToken(): string | null {
  return localStorage.getItem("token");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;

    try {
      const data: unknown = await res.json();

      if (isObject(data) && typeof data.message === "string") {
        msg = data.message;
      }
    } catch (err) {
      console.error("Error response is not JSON", err);
    }

    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}
