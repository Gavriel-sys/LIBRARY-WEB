import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setAuth } from "@/features/auth/authSlice";
import { api } from "@/lib/api";

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const registerMutation = useMutation({
    mutationFn: api.register,
    onSuccess: (data) => {
      dispatch(setAuth(data));
      toast.success("Register berhasil");
      navigate("/books");
    },
    onError: (error) => toast.error(error.message || "Register gagal"),
  });

  return (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6">
      <h1 className="mb-4 text-2xl font-semibold">Register</h1>
      <div className="space-y-3">
        <Input placeholder="Nama" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} />
        <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} />
        <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} />
        <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))} />
        <Button
          className="w-full"
          disabled={registerMutation.isPending || Object.values(form).some((x) => !x)}
          onClick={() => registerMutation.mutate(form)}
        >
          {registerMutation.isPending ? "Loading..." : "Register"}
        </Button>
        <p className="text-sm">
          Sudah punya akun? <Link className="text-blue-600" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
