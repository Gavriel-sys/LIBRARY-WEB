import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/app/hooks";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

export function MyReviewsPage() {
  const token = useAppSelector((s) => s.auth.token);
  const reviewsQuery = useQuery({ queryKey: ["my-reviews"], queryFn: () => api.getMyReviews(token ?? ""), enabled: Boolean(token) });

  if (reviewsQuery.isLoading) return <p>Loading reviews...</p>;
  if (reviewsQuery.isError) return <p className="text-red-500">Gagal memuat reviews.</p>;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">My Reviews</h1>
      {(reviewsQuery.data ?? []).map((review) => (
        <Card key={review.id}>
          <p className="font-medium">{review.book?.title ?? `Book #${review.bookId}`}</p>
          <p className="text-sm">⭐ {review.star}</p>
          <p className="text-sm">{review.comment}</p>
          <p className="text-xs text-slate-500">{dayjs(review.createdAt).format("DD MMM YYYY HH:mm")}</p>
        </Card>
      ))}
    </div>
  );
}
