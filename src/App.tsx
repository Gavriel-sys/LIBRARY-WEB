import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/authSlice";
import { BookDetailPage } from "@/pages/BookDetailPage";
import { BooksPage } from "@/pages/BooksPage";
import { CartPage } from "@/pages/CartPage";
import { LoansPage } from "@/pages/LoansPage";
import { LoginPage } from "@/pages/LoginPage";
import { MyReviewsPage } from "@/pages/MyReviewsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RegisterPage } from "@/pages/RegisterPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";

export function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen">
      {token && (
        <header className="border-b bg-white">
          <nav className="container flex h-14 items-center gap-4 text-sm">
            <Link to="/books">Books</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/loans">My Loans</Link>
            <Link to="/my-reviews">My Reviews</Link>
            <Link to="/profile">Profile</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
            <Button className="ml-auto" variant="outline" size="sm" onClick={() => dispatch(logout())}>
              Logout
            </Button>
          </nav>
        </header>
      )}
      <main className="container py-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/books" element={token ? <BooksPage /> : <Navigate to="/login" />} />
          <Route path="/books/:id" element={token ? <BookDetailPage /> : <Navigate to="/login" />} />
          <Route path="/cart" element={token ? <CartPage /> : <Navigate to="/login" />} />
          <Route path="/loans" element={token ? <LoansPage /> : <Navigate to="/login" />} />
          <Route path="/my-reviews" element={token ? <MyReviewsPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={token && isAdmin ? <AdminDashboardPage /> : <Navigate to="/books" />} />
          <Route path="*" element={<Navigate to={token ? "/books" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}
