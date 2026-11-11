export type UserRole = "master" | "admin" | "user";

export interface AuthUser {
  id: number;
  companyId: number;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive" | "blocked";
}

const TOKEN_KEY = "estoque_facil_token";
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function getToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || "Não foi possível concluir a solicitação.");
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const api = {
  async login(email: string, password: string) {
    const result = await request<{ token: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    window.localStorage.setItem(TOKEN_KEY, result.token);
    return result.user;
  },

  register(data: {
    fullName: string;
    username: string;
    document: string;
    companyName: string;
    activity: string;
    cep: string;
    address: string;
    city: string;
    state: string;
    email: string;
    password: string;
  }) {
    return request<{ message: string; userId: number }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async me() {
    const result = await request<{ user: AuthUser }>("/auth/me");
    return result.user;
  },

  async products<T>() {
    const result = await request<{ products: T[] }>("/products");
    return result.products;
  },

  createProduct<T extends object>(product: T) {
    return request<{ id: number; message: string }>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },

  deleteProduct(id: number) {
    return request<void>(`/products/${id}`, { method: "DELETE" });
  },
};
