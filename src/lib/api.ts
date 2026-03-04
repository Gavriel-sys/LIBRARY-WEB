import type { AuthResponse, Book, Loan, Review, User } from "@/types";

const BASE_URL =
  import.meta.env.VITE_API_URL ??
  "https://library-backend-production-b9cf.up.railway.app";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type ApiEnvelope<T> = T | { data?: T; result?: T; payload?: T };

interface RequestOptions {
  method?: HttpMethod;
  token?: string | null;
  body?: unknown;
  formData?: FormData;
}

function unwrapEnvelope<T>(value: ApiEnvelope<T>): T {
  if (value && typeof value === "object") {
    const asObj = value as { data?: T; result?: T; payload?: T };
    if (asObj.data !== undefined) return asObj.data;
    if (asObj.result !== undefined) return asObj.result;
    if (asObj.payload !== undefined) return asObj.payload;
  }
  return value as T;
}

function extractAuthResponse(raw: ApiEnvelope<AuthResponse>): AuthResponse {
  const payload = unwrapEnvelope(raw);
  if (!payload?.token || !payload?.user) {
    throw new Error("Format response auth tidak valid");
  }
  return payload;
}

function extractList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const candidates = [
      obj.items,
      obj.content,
      obj.rows,
      obj.books,
      obj.loans,
      obj.reviews,
      obj.users,
      obj.data,
    ];
    const match = candidates.find((item) => Array.isArray(item));
    if (Array.isArray(match)) return match as T[];
  }
  return [];
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (!options.formData) headers["Content-Type"] = "application/json";

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body:
      options.formData ??
      (options.body ? JSON.stringify(options.body) : undefined),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return {} as T;
  const body = (await response.json()) as ApiEnvelope<T>;
  return unwrapEnvelope<T>(body);
}

export const api = {
  login: async (payload: { email: string; password: string }) => {
    const raw = await request<ApiEnvelope<AuthResponse>>("/api/auth/login", {
      method: "POST",
      body: payload,
    });
    return extractAuthResponse(raw);
  },
  register: async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const raw = await request<ApiEnvelope<AuthResponse>>("/api/auth/register", {
      method: "POST",
      body: payload,
    });
    return extractAuthResponse(raw);
  },

  getBooks: async (params?: { q?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();

    if (params?.q) query.append("q", params.q);
    if (params?.page !== undefined) query.append("page", String(params.page));
    if (params?.limit !== undefined)
      query.append("limit", String(params.limit));

    const res = await request<{
      books: Book[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/api/books?${query.toString()}`);

    return res;
  },
  getBookDetail: (id: number) => request<Book>(`/api/books/${id}`),

  borrowBook: (payload: { bookId: number; days: number }, token: string) =>
    request<Loan>("/api/loans", { method: "POST", body: payload, token }),
  borrowFromCart: (
    payload: { itemIds: number[]; days: number; borrowDate: string },
    token: string,
  ) =>
    request<Loan[]>("/api/loans/from-cart", {
      method: "POST",
      body: payload,
      token,
    }),
  getMyLoans: async (token: string) =>
    extractList<Loan>(await request<unknown>("/api/loans/my", { token })),

  getBookReviews: async (bookId: number) =>
    extractList<Review>(await request<unknown>(`/api/reviews/book/${bookId}`)),
  addReview: (
    payload: { bookId: number; star: number; comment: string },
    token: string,
  ) =>
    request<Review>("/api/reviews", { method: "POST", body: payload, token }),
  deleteReview: (id: number, token: string) =>
    request<void>(`/api/reviews/${id}`, { method: "DELETE", token }),

  getMe: (token: string) => request<User>("/api/me", { token }),
  updateMe: (
    payload: { name: string; phone: string; profilePhoto?: File | null },
    token: string,
  ) => {
    const fd = new FormData();
    fd.append("name", payload.name);
    fd.append("phone", payload.phone);
    if (payload.profilePhoto) fd.append("profilePhoto", payload.profilePhoto);
    return request<User>("/api/me", { method: "PATCH", token, formData: fd });
  },
  getMyProfileLoans: async (token: string) =>
    extractList<Loan>(await request<unknown>("/api/me/loans", { token })),
  getMyReviews: async (token: string) =>
    extractList<Review>(await request<unknown>("/api/me/reviews", { token })),

  adminBooks: async (token: string) =>
    extractList<Book>(await request<unknown>("/api/admin/books", { token })),
  adminLoans: async (token: string) =>
    extractList<Loan>(await request<unknown>("/api/admin/loans", { token })),
  adminOverdue: async (token: string) =>
    extractList<Loan>(
      await request<unknown>("/api/admin/loans/overdue", { token }),
    ),
  adminOverview: (token: string) =>
    request<Record<string, number>>("/api/admin/overview", { token }),
  adminUsers: async (token: string) =>
    extractList<User>(await request<unknown>("/api/admin/users", { token })),
};
