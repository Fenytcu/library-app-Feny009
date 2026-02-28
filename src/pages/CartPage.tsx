import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { cartApi } from "@/features/cart/cartApi";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Trash2, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { CartItem } from "@/types/cart";

// ─── Custom Checkbox ─────────────────────────────────────────────────────────
function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        checked ? "bg-blue-600 border-blue-600" : "border-neutral-300 bg-white hover:border-blue-400"
      }`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Checked item IDs
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

  // ── Fetch Cart ──
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  const items: CartItem[] = cartData?.data?.items ?? [];

  // Sync "select all" default when items load
  const allChecked = items.length > 0 && checkedIds.size === items.length;

  const toggleAll = () => {
    if (allChecked) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(items.map((i) => i.id)));
    }
  };

  const toggleItem = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Remove Item ──
  const removeMutation = useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: () => {
      toast.success("Item removed");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => toast.error("Failed to remove item"),
  });

  const removeSelectedMutation = useMutation({
    mutationFn: async (itemIds: number[]) => {
      await Promise.all(itemIds.map((id) => cartApi.removeFromCart(id)));
    },
    onSuccess: () => {
      toast.success("Selected items removed");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setCheckedIds(new Set());
    },
    onError: () => toast.error("Failed to remove selected items"),
  });

  // ── Borrow ──
  const handleBorrow = () => {
    if (checkedIds.size === 0) return;
    navigate("/checkout");
  };

  const handleRemoveSelected = () => {
    if (checkedIds.size === 0) return;
    removeSelectedMutation.mutate(Array.from(checkedIds));
  };

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 font-quicksand">
        <LandingNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  // ── Empty State ──
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 font-quicksand">
        <LandingNavbar />
        <div className="w-full px-4 md:px-10 py-8 md:py-12 flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-[24px] font-bold text-neutral-900">Your cart is empty</h2>
          <p className="text-neutral-500 text-[16px]">Browse our collection and add books to borrow.</p>
          <Link
            to="/home"
            className="inline-flex h-[48px] px-8 items-center rounded-full bg-blue-600 text-white font-quicksand font-bold text-[16px] hover:bg-blue-700 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  // ── Cart Row ──
  const CartRow = ({ item }: { item: CartItem }) => {
    const checked = checkedIds.has(item.id);
    return (
      <div
        className={`flex items-center gap-3 md:gap-4 p-4 rounded-[12px] border-2 transition-all ${
          checked ? "border-blue-500 bg-blue-50/30" : "border-neutral-100 bg-white"
        }`}
      >
        {/* Checkbox */}
        <Checkbox checked={checked} onChange={() => toggleItem(item.id)} />

        {/* Book Cover */}
        <div className="w-[60px] h-[80px] md:w-[72px] md:h-[96px] rounded-[8px] overflow-hidden flex-shrink-0 bg-neutral-100">
          <img
            src={item.book.coverImage}
            alt={item.book.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          {item.book.category?.name && (
            <span className="inline-block text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-1 font-quicksand">
              {item.book.category.name}
            </span>
          )}
          <h3 className="font-bold text-[15px] md:text-[17px] text-neutral-900 line-clamp-1 font-quicksand">
            {item.book.title}
          </h3>
          <p className="text-[13px] md:text-[14px] text-neutral-500 font-medium font-quicksand line-clamp-1">
            {item.book.author?.name}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeMutation.mutate(item.id)}
          disabled={removeMutation.isPending}
          className="p-3 -mr-2 rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-5 h-5 md:w-5 md:h-5" />
        </button>
      </div>
    );
  };

  // ── Borrow Button (shared) ──
  const BorrowButton = ({ full = false }: { full?: boolean }) => (
    <button
      onClick={handleBorrow}
      disabled={checkedIds.size === 0}
      className={`${full ? "w-full" : "min-w-[160px]"} h-[48px] rounded-full font-quicksand font-bold text-[16px] transition-all
        ${checkedIds.size > 0
          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
          : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
        }`}
    >
      Borrow Book
    </button>
  );

  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand pb-[88px] md:pb-0">
      <LandingNavbar />

      <main className="w-full px-4 md:px-10 py-8 md:py-12">
        {/* Page Title */}
        <h1 className="text-[28px] md:text-[36px] font-bold text-neutral-900 mb-6 md:mb-8">
          My Cart
        </h1>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

          {/* ── Left: Item List ────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Select All */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={allChecked}
                  onChange={toggleAll}
                />
                <span className="font-quicksand font-semibold text-[15px] text-neutral-700">
                  Select All
                </span>
              </div>
              {checkedIds.size > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  disabled={removeSelectedMutation.isPending}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold text-[14px] transition-colors p-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected ({checkedIds.size})</span>
                </button>
              )}
            </div>

            {/* Item Rows */}
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <CartRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* ── Right: Loan Summary (Desktop Only) ────────────────────── */}
          <aside className="hidden md:block w-[280px] flex-shrink-0">
            <div className="bg-white rounded-[16px] p-6 shadow-[0_0_20px_rgba(203,202,202,0.25)] sticky top-[88px]">
              <h3 className="font-quicksand font-bold text-[18px] text-neutral-900 mb-5">
                Loan Summary
              </h3>

              <div className="flex items-center justify-between mb-6">
                <span className="font-quicksand text-[15px] text-neutral-600 font-medium">
                  Total Book
                </span>
                <span className="font-quicksand font-bold text-[15px] text-neutral-900">
                  {checkedIds.size} item{checkedIds.size !== 1 ? "s" : ""}
                </span>
              </div>

              <BorrowButton full />
            </div>
          </aside>
        </div>
      </main>

      {/* ── Mobile Sticky Bottom Bar ───────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-quicksand text-[12px] text-neutral-500 font-medium">
              Total Book
            </span>
            <span className="font-quicksand font-bold text-[16px] text-neutral-900">
              {checkedIds.size} item{checkedIds.size !== 1 ? "s" : ""}
            </span>
          </div>
          <BorrowButton />
        </div>
      </div>
    </div>
  );
}
