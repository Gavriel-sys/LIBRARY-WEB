import { useState } from "react";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookCover } from "@/components/ui/book-cover";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { Book } from "@/types";

export function BookDetailPage() {
  const { id = "0" } = useParams();
  const bookId = Number(id);
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const qc = useQueryClient();
  const [comment, setComment] = useState("");
  const [star, setStar] = useState(5);

  const bookQuery = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => api.getBookDetail(bookId),
  });
  const reviewsQuery = useQuery({
    queryKey: ["reviews", bookId],
    queryFn: () => api.getBookReviews(bookId),
  });

  const borrowMutation = useMutation({
    mutationFn: () => api.borrowBook({ bookId, days: 7 }, token ?? ""),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["book", bookId] });
      const previous = qc.getQueryData<Book>(["book", bookId]);
      if (previous) {
        qc.setQueryData<Book>(["book", bookId], {
          ...previous,
          availableCopies: Math.max(0, previous.availableCopies - 1),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(["book", bookId], ctx.previous);
      toast.error("Gagal meminjam buku");
    },
    onSuccess: () => {
      toast.success("Buku berhasil dipinjam");
      qc.invalidateQueries({ queryKey: ["books"] });
      qc.invalidateQueries({ queryKey: ["loans"] });
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: () => api.addReview({ bookId, star, comment }, token ?? ""),
    onSuccess: () => {
      setComment("");
      setStar(5);
      toast.success("Review berhasil ditambahkan");
      qc.invalidateQueries({ queryKey: ["reviews", bookId] });
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
    },
    onError: () => toast.error("Gagal menambahkan review"),
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: number) => api.deleteReview(reviewId, token ?? ""),
    onSuccess: () => {
      toast.success("Review dihapus");
      qc.invalidateQueries({ queryKey: ["reviews", bookId] });
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
    },
  });

  if (bookQuery.isLoading || reviewsQuery.isLoading)
    return <p>Loading detail...</p>;
  if (bookQuery.isError || !bookQuery.data)
    return <p className="text-red-500">Buku tidak ditemukan.</p>;

  return (
    <div className="space-y-4">
      <Card>
        <BookCover
          title={bookQuery.data.title}
          coverImage={bookQuery.data.coverImage}
          className="mb-4 h-72 md:h-80"
        />
        <h1 className="text-2xl font-semibold">{bookQuery.data.title}</h1>
        <p className="text-sm text-slate-500">
          {bookQuery.data.author?.name} • {bookQuery.data.category?.name}
        </p>
        <p className="mt-2">
          {bookQuery.data.description || "Tidak ada deskripsi"}
        </p>
        <p className="mt-2 font-medium">
          Stok: {bookQuery.data.availableCopies}
        </p>
        <Button
          className="mt-3"
          onClick={() => borrowMutation.mutate()}
          disabled={
            !token ||
            borrowMutation.isPending ||
            bookQuery.data.availableCopies <= 0
          }
        >
          Pinjam 7 hari
        </Button>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">Tambah Review</h2>
        <div className="grid gap-2 md:grid-cols-[120px_1fr_auto]">
          <Input
            type="number"
            min={1}
            max={5}
            value={star}
            onChange={(e) => setStar(Number(e.target.value))}
          />
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Komentar..."
          />
          <Button
            onClick={() => addReviewMutation.mutate()}
            disabled={!comment || !token}
          >
            Kirim
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold">Review</h2>
        <div className="space-y-2">
          {(reviewsQuery.data ?? []).map((review) => (
            <div key={review.id} className="rounded border p-3 text-sm">
              <p className="font-medium">
                {review.user?.name ?? "User"} • ⭐ {review.star}
              </p>
              <p>{review.comment}</p>
              <p className="text-xs text-slate-500">
                {dayjs(review.createdAt).format("DD MMM YYYY HH:mm")}
              </p>
              {(user?.id === review.user?.id || user?.role === "ADMIN") && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteReviewMutation.mutate(review.id)}
                >
                  Hapus
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
