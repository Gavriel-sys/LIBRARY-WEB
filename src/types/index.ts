export type Role = "USER" | "ADMIN";
export type LoanStatus = "BORROWED" | "RETURNED" | "OVERDUE";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  profilePhoto?: string;
}

export interface Author {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  description?: string;
  stock: number;
  author?: Author;
  category?: Category;
  coverImage?: string;
}

export interface Review {
  id: number;
  bookId: number;
  star: number;
  comment: string;
  createdAt: string;
  user?: Pick<User, "id" | "name">;
  book?: Pick<Book, "id" | "title">;
}

export interface Loan {
  id: number;
  status: LoanStatus;
  dueDate: string;
  borrowDate: string;
  returnedAt?: string;
  book?: Pick<Book, "id" | "title">;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ProfileStats {
  total: number;
  borrowed: number;
  returned: number;
  overdue: number;
}
