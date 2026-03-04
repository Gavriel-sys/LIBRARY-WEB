import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookCover } from "@/components/ui/book-cover";
import { Input } from "@/components/ui/input";
import { addToCart } from "@/features/cart/cartSlice";
import { setCategory, setSearch } from "@/features/ui/uiSlice";
import { api } from "@/lib/api";

export function BooksPage() {
  const dispatch = useAppDispatch();
  const { search, category } = useAppSelector((s) => s.ui);

  const booksQuery = useQuery({ queryKey: ["books"], queryFn: api.getBooks });

  const books = useMemo(() => {
    const all = Array.isArray(booksQuery.data) ? booksQuery.data : [];
    return all.filter((book) => {
      const bySearch = `${book.title} ${book.author?.name ?? ""}`.toLowerCase().includes(search.toLowerCase());
      const byCategory = category === "all" || book.category?.name === category;
      return bySearch && byCategory;
    });
  }, [booksQuery.data, search, category]);

  const categories = Array.from(new Set((Array.isArray(booksQuery.data) ? booksQuery.data : []).map((b) => b.category?.name).filter(Boolean))) as string[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Book List</h1>
      <div className="grid gap-2 md:grid-cols-2">
        <Input placeholder="Cari judul / author..." value={search} onChange={(e) => dispatch(setSearch(e.target.value))} />
        <select className="h-10 rounded-md border border-slate-300 px-3" value={category} onChange={(e) => dispatch(setCategory(e.target.value))}>
          <option value="all">Semua kategori</option>
          {categories.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {booksQuery.isLoading && <p>Loading books...</p>}
      {booksQuery.isError && <p className="text-red-500">Gagal memuat buku.</p>}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book.id}>
            <BookCover title={book.title} coverImage={book.coverImage} className="mb-3 h-52" />
            <h2 className="font-semibold">{book.title}</h2>
            <p className="text-sm text-slate-500">{book.author?.name ?? "Unknown"} • {book.category?.name ?? "Uncategorized"}</p>
            <p className="mt-2 text-sm">Stok: {book.stock}</p>
            <div className="mt-3 flex items-center gap-3">
              <Link className="text-blue-600" to={`/books/${book.id}`}>Detail</Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  dispatch(addToCart(book));
                  toast.success("Buku ditambahkan ke cart");
                }}
              >
                Add to cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
