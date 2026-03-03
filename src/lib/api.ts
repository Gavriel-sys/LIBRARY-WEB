import type { AuthResponse, Book, Loan, Review, User } from "@/types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "https://library-backend-production-b9cf.up.railway.app";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  token?: string | null;
  body?: unknown;
  formData?: FormData;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (!options.formData) headers["Content-Type"] = "application/json";

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.formData ?? (options.body ? JSON.stringify(options.body) : undefined),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return {} as T;
  return (await response.json()) as T;
}

export const api = {
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: payload }),
  register: (payload: { name: string; email: string; phone: string; password: string }) =>
    request<AuthResponse>("/api/auth/register", { method: "POST", body: payload }),

  getBooks: () => request<Book[]>("/api/books"),
  getBookDetail: (id: number) => request<Book>(`/api/books/${id}`),

  borrowBook: (payload: { bookId: number; days: number }, token: string) =>
    request<Loan>("/api/loans", { method: "POST", body: payload, token }),
  borrowFromCart: (payload: { itemIds: number[]; days: number; borrowDate: string }, token: string) =>
    request<Loan[]>("/api/loans/from-cart", { method: "POST", body: payload, token }),
  getMyLoans: (token: string) => request<Loan[]>("/api/loans/my", { token }),

  getBookReviews: (bookId: number) => request<Review[]>(`/api/reviews/book/${bookId}`),
  addReview: (payload: { bookId: number; star: number; comment: string }, token: string) =>
    request<Review>("/api/reviews", { method: "POST", body: payload, token }),
  deleteReview: (id: number, token: string) => request<void>(`/api/reviews/${id}`, { method: "DELETE", token }),

  getMe: (token: string) => request<User>("/api/me", { token }),
  updateMe: (payload: { name: string; phone: string; profilePhoto?: File | null }, token: string) => {
    const fd = new FormData();
    fd.append("name", payload.name);
    fd.append("phone", payload.phone);
    if (payload.profilePhoto) fd.append("profilePhoto", payload.profilePhoto);
    return request<User>("/api/me", { method: "PATCH", token, formData: fd });
  },
  getMyProfileLoans: (token: string) => request<Loan[]>("/api/me/loans", { token }),
  getMyReviews: (token: string) => request<Review[]>("/api/me/reviews", { token }),

  adminBooks: (token: string) => request<Book[]>("/api/admin/books", { token }),
  adminLoans: (token: string) => request<Loan[]>("/api/admin/loans", { token }),
  adminOverdue: (token: string) => request<Loan[]>("/api/admin/loans/overdue", { token }),
  adminOverview: (token: string) => request<Record<string, number>>("/api/admin/overview", { token }),
  adminUsers: (token: string) => request<User[]>("/api/admin/users", { token }),
};
