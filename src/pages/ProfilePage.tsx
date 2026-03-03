import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/features/auth/authSlice";
import { api } from "@/lib/api";

export function ProfilePage() {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  const meQuery = useQuery({ queryKey: ["me"], queryFn: () => api.getMe(token ?? ""), enabled: Boolean(token) });
  const loansQuery = useQuery({ queryKey: ["my-profile-loans"], queryFn: () => api.getMyProfileLoans(token ?? ""), enabled: Boolean(token) });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const stats = useMemo(() => {
    const list = loansQuery.data ?? [];
    return {
      total: list.length,
      borrowed: list.filter((loan) => loan.status === "BORROWED").length,
      returned: list.filter((loan) => loan.status === "RETURNED").length,
      overdue: list.filter((loan) => loan.status === "OVERDUE").length,
    };
  }, [loansQuery.data]);

  const updateMutation = useMutation({
    mutationFn: () => api.updateMe({ name: name || meQuery.data?.name || "", phone: phone || meQuery.data?.phone || "", profilePhoto: file }, token ?? ""),
    onSuccess: (data) => {
      dispatch(updateUser(data));
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile berhasil diupdate");
    },
    onError: () => toast.error("Gagal update profile"),
  });

  if (meQuery.isLoading || loansQuery.isLoading) return <p>Loading profile...</p>;
  if (meQuery.isError) return <p className="text-red-500">Gagal memuat profile.</p>;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <Card className="space-y-2">
        <p className="font-medium">{meQuery.data?.name}</p>
        <p className="text-sm text-slate-600">{meQuery.data?.email}</p>
        <p className="text-sm text-slate-600">Role: {meQuery.data?.role}</p>
      </Card>

      <Card className="space-y-2">
        <h2 className="font-semibold">Update Profile</h2>
        <Input placeholder="Nama" defaultValue={meQuery.data?.name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Phone" defaultValue={meQuery.data?.phone} onChange={(e) => setPhone(e.target.value)} />
        <Input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>Simpan</Button>
      </Card>

      <Card>
        <p>Total Loans: {stats.total}</p>
        <p>BORROWED: {stats.borrowed}</p>
        <p>RETURNED: {stats.returned}</p>
        <p>OVERDUE: {stats.overdue}</p>
      </Card>
    </div>
  );
}
