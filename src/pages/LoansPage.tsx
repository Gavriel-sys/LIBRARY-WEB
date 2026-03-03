import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/app/hooks";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

export function LoansPage() {
  const token = useAppSelector((s) => s.auth.token);
  const loansQuery = useQuery({ queryKey: ["loans"], queryFn: () => api.getMyLoans(token ?? ""), enabled: Boolean(token) });

  if (loansQuery.isLoading) return <p>Loading loans...</p>;
  if (loansQuery.isError) return <p className="text-red-500">Gagal memuat data pinjaman.</p>;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">My Loans</h1>
      {loansQuery.data?.map((loan) => (
        <Card key={loan.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{loan.book?.title ?? `Book #${loan.id}`}</p>
            <p className="text-sm text-slate-600">Borrow: {dayjs(loan.borrowDate).format("DD MMM YYYY")}</p>
            <p className="text-sm text-slate-600">Due: {dayjs(loan.dueDate).format("DD MMM YYYY")}</p>
          </div>
          <Badge>{loan.status}</Badge>
        </Card>
      ))}
    </div>
  );
}
