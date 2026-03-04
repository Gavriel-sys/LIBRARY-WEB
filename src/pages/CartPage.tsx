import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clearCart, removeFromCart } from "@/features/cart/cartSlice";
import { api } from "@/lib/api";

export function CartPage() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const items = useAppSelector((s) => s.cart.items);
  const token = useAppSelector((s) => s.auth.token);

  const checkoutMutation = useMutation({
    mutationFn: () =>
      api.borrowFromCart(
        {
          itemIds: items.map((item) => item.id),
          days: 3,
          borrowDate: dayjs().format("YYYY-MM-DD"),
        },
        token ?? "",
      ),
    onSuccess: () => {
      dispatch(clearCart());
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Borrow dari cart berhasil");
    },
    onError: () => toast.error("Borrow cart gagal"),
  });

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Cart</h1>
      {!items.length && <p>Cart masih kosong.</p>}
      {items.map((item) => (
        <Card key={item.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-slate-500">
              Stock: {item.availableCopies}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => dispatch(removeFromCart(item.id))}
          >
            Hapus
          </Button>
        </Card>
      ))}
      <Button
        disabled={!items.length || checkoutMutation.isPending || !token}
        onClick={() => checkoutMutation.mutate()}
      >
        Confirm & Borrow
      </Button>
    </div>
  );
}
