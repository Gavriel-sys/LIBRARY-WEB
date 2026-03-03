import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setAuth } from "@/features/auth/authSlice";
import { api } from "@/lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      dispatch(setAuth(data));
      toast.success("Login berhasil");
      navigate("/books");
    },
    onError: (error) => toast.error(error.message || "Login gagal"),
  });

  return (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6">
      <h1 className="mb-4 text-2xl font-semibold">Login</h1>
      <div className="space-y-3">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className="w-full" disabled={loginMutation.isPending || !email || !password} onClick={() => loginMutation.mutate({ email, password })}>
          {loginMutation.isPending ? "Loading..." : "Login"}
        </Button>
        <p className="text-sm">
          Belum punya akun? <Link className="text-blue-600" to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
