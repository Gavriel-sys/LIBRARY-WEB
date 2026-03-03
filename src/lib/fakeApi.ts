import dayjs from "dayjs";
import type { Book, Loan, Review, User } from "@/types";

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

let books: Book[] = [
  { id: "1", title: "Atomic Habits", author: "James Clear", category: "Self Help", stock: 4, description: "Habit building." },
  { id: "2", title: "Clean Code", author: "Robert C. Martin", category: "Programming", stock: 2, description: "Software craftsmanship." },
  { id: "3", title: "The Pragmatic Programmer", author: "Hunt & Thomas", category: "Programming", stock: 3, description: "Engineering mindset." },
];

let reviews: Review[] = [
  { id: "rv1", bookId: "1", userName: "Alya", comment: "Sangat membantu.", createdAt: dayjs().subtract(1, "day").toISOString() },
];

const currentUser: User = { id: "u1", name: "Demo User", email: "demo@library.app", role: "USER" };

export const api = {
  async login() {
    await wait();
    return { token: "demo-token", user: currentUser };
  },
  async register() {
    await wait();
    return { token: "demo-token", user: currentUser };
  },
  async getBooks(search = "", category = "all") {
    await wait();
    return books.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) && (category === "all" || b.category === category),
    );
  },
  async getBookDetail(id: string) {
    await wait();
    return {
      book: books.find((b) => b.id === id),
      reviews: reviews.filter((r) => r.bookId === id),
    };
  },
  async borrowBook(bookId: string) {
    await wait();
    books = books.map((b) => (b.id === bookId ? { ...b, stock: Math.max(0, b.stock - 1) } : b));
    return { ok: true };
  },
  async addReview(bookId: string, comment: string) {
    await wait();
    const review: Review = { id: crypto.randomUUID(), bookId, userName: currentUser.name, comment, createdAt: dayjs().toISOString() };
    reviews = [review, ...reviews];
    return review;
  },
  async deleteReview(reviewId: string) {
    await wait();
    reviews = reviews.filter((r) => r.id !== reviewId);
    return { ok: true };
  },
  async getLoans(): Promise<Loan[]> {
    await wait();
    return [
      { id: "l1", bookTitle: "Atomic Habits", status: "BORROWED", borrowedAt: dayjs().subtract(2, "day").toISOString(), dueDate: dayjs().add(5, "day").toISOString() },
      { id: "l2", bookTitle: "Clean Code", status: "RETURNED", borrowedAt: dayjs().subtract(15, "day").toISOString(), dueDate: dayjs().subtract(8, "day").toISOString() },
    ];
  },
  async getProfile() {
    await wait();
    const loans = await this.getLoans();
    return {
      user: currentUser,
      stats: {
        total: loans.length,
        borrowed: loans.filter((l) => l.status === "BORROWED").length,
        returned: loans.filter((l) => l.status === "RETURNED").length,
      },
    };
  },
};
