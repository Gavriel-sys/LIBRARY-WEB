import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/app/hooks";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

export function AdminDashboardPage() {
  const token = useAppSelector((s) => s.auth.token);

  const overviewQuery = useQuery({ queryKey: ["admin-overview"], queryFn: () => api.adminOverview(token ?? ""), enabled: Boolean(token) });
  const booksQuery = useQuery({ queryKey: ["admin-books"], queryFn: () => api.adminBooks(token ?? ""), enabled: Boolean(token) });
  const loansQuery = useQuery({ queryKey: ["admin-loans"], queryFn: () => api.adminLoans(token ?? ""), enabled: Boolean(token) });
  const overdueQuery = useQuery({ queryKey: ["admin-overdue"], queryFn: () => api.adminOverdue(token ?? ""), enabled: Boolean(token) });
  const usersQuery = useQuery({ queryKey: ["admin-users"], queryFn: () => api.adminUsers(token ?? ""), enabled: Boolean(token) });

  if ([overviewQuery, booksQuery, loansQuery, overdueQuery, usersQuery].some((q) => q.isLoading)) return <p>Loading admin data...</p>;
  if ([overviewQuery, booksQuery, loansQuery, overdueQuery, usersQuery].some((q) => q.isError)) return <p className="text-red-500">Gagal memuat admin dashboard.</p>;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <Card>
        <h2 className="font-semibold">Overview</h2>
        <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(overviewQuery.data, null, 2)}</pre>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>Total Books: {booksQuery.data?.length ?? 0}</Card>
        <Card>Total Users: {usersQuery.data?.length ?? 0}</Card>
        <Card>Total Loans: {loansQuery.data?.length ?? 0}</Card>
        <Card>Overdue Loans: {overdueQuery.data?.length ?? 0}</Card>
      </div>
    </div>
  );
}
