import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { cartApi } from "@/features/cart/cartApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CartItem } from "@/types/cart";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Borrow date (today by default)
  const [borrowDate, setBorrowDate] = useState<Date>(new Date());

  // Duration in days
  const [duration, setDuration] = useState<3 | 5 | 10>(3);

  // Agreements
  const [agreeReturn, setAgreeReturn] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  // Return date computed from borrow date + duration
  const returnDate = useMemo(() => addDays(borrowDate, duration), [borrowDate, duration]);

  // ── Fetch checkout info ──
  const { data, isLoading } = useQuery({
    queryKey: ["checkout"],
    queryFn: cartApi.getCheckout,
  });

  // ── Confirm borrow mutation ──
  const borrowMutation = useMutation({
    mutationFn: () => {
      const itemIds = items.map(item => item.id);
      return cartApi.confirmBorrow({ 
        itemIds,
        borrowDuration: duration 
      });
    },
    onSuccess: () => {
      // Invalidate queries to sync data
      queryClient.invalidateQueries({ queryKey: ["cart"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["my-loans"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["checkout"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["profile"], refetchType: "all" });
      
      navigate("/checkout/success", { state: { returnDate: returnDate.toISOString() } });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to confirm borrow. Please try again.";
      toast.error(message);
      console.error("Borrow error detailed:", {
        status: error.response?.status,
        data: error.response?.data,
        error: error
      });
    },
  });

  // ── Loading state ──
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

  const user = data?.data?.user;
  const items: CartItem[] = data?.data?.items ?? [];

  const canConfirm = agreeReturn && agreePolicy;

  // ── Borrow Date native input (yyyy-mm-dd) ──
  const borrowDateInputValue = borrowDate.toISOString().slice(0, 10);

  const handleBorrowDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) setBorrowDate(new Date(val + "T00:00:00"));
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand">
      <LandingNavbar />

      <main className="w-full px-4 md:px-10 py-8 md:py-12">
        {/* ── Page Title ─────────────────────────────────────── */}
        <h1 className="text-[24px] md:text-[36px] font-bold text-neutral-900 mb-6 md:mb-8">
          Checkout
        </h1>

        {/* ── Two-column layout (desktop), single-column (mobile) ── */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-[58px] items-start">

          {/* ══════════════════════════════════════════════════════
              LEFT PANEL
          ══════════════════════════════════════════════════════ */}
          <div className="w-full md:flex-1">

            {/* ── User Information ── */}
            <h2 className="text-[18px] md:text-[24px] font-bold text-neutral-900 mb-4 md:mb-6">
              User Information
            </h2>

            {user && (
              <div className="flex flex-col gap-0">
                {/* Name row */}
                <div className="flex items-center justify-between mb-[16px] md:mb-[32px]">
                  <span className="text-[14px] md:text-[16px] font-medium text-neutral-900">
                    Name
                  </span>
                  <span className="text-[14px] md:text-[16px] font-medium text-neutral-900 text-right">
                    {user.name}
                  </span>
                </div>
                {/* Email row */}
                <div className="flex items-center justify-between mb-[16px] md:mb-[32px]">
                  <span className="text-[14px] md:text-[16px] font-medium text-neutral-900">
                    Email
                  </span>
                  <span className="text-[14px] md:text-[16px] font-medium text-neutral-900 text-right">
                    {user.email}
                  </span>
                </div>
                {/* Phone row */}
                <div className="flex items-center justify-between">
                  <span className="text-[14px] md:text-[16px] font-medium text-neutral-900">
                    Nomor Handphone
                  </span>
                  <span className="text-[14px] md:text-[16px] font-medium text-neutral-900 text-right">
                    {user.nomorHandphone}
                  </span>
                </div>
              </div>
            )}

            {/* ── Divider ── */}
            <div
              className="my-[16px] md:my-[32px]"
              style={{ width: "100%", maxWidth: "466px", height: "1px", background: "#D5D7DA" }}
            />

            {/* ── Book List ── */}
            <h2 className="text-[18px] md:text-[24px] font-bold text-neutral-900 mb-4 md:mb-6">
              Book List
            </h2>

            <div className="flex flex-col gap-4 md:gap-6">
              {items.map((item) => (
                <BookListItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              RIGHT PANEL — 478x640, border, radius-20px, shadow
          ══════════════════════════════════════════════════════ */}
          <div
            className="w-full md:w-[478px] flex-shrink-0 bg-white rounded-[20px] border border-[#D5D7DA] p-5 md:p-[20px]"
            style={{ boxShadow: "0px 4px 20px 0px rgba(203,202,202,0.5)" }}
          >
            {/* Title */}
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#0A0D12] mb-[16px] md:mb-[24px]">
              Complete Your Borrow Request
            </h2>

            {/* ── Borrow Date ── */}
            <p className="text-[14px] md:text-[16px] font-bold text-[#0A0D12] mb-2">
              Borrow Date
            </p>
            <label className="flex items-center justify-between bg-[#F5F5F5] border border-[#D5D7DA] rounded-xl px-4 py-3 mb-4 md:mb-6 cursor-pointer w-full">
              <span className="text-[16px] font-semibold text-neutral-800">
                {formatDate(borrowDate)}
              </span>
              <div className="relative flex items-center">
                <img
                  src="/assets/calendar.png"
                  alt="calendar"
                  className="w-5 h-5 object-contain"
                />
                <input
                  type="date"
                  value={borrowDateInputValue}
                  onChange={handleBorrowDateChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                />
              </div>
            </label>

            {/* ── Borrow Duration ── */}
            <p className="text-[14px] md:text-[16px] font-bold text-[#0A0D12] mb-3">
              Borrow Duration
            </p>
            <div className="flex flex-col gap-3 mb-4 md:mb-6">
              {([3, 5, 10] as const).map((d) => (
                <label key={d} className="flex items-center gap-3 cursor-pointer">
                  {/* Radio as styled circle */}
                  <button
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      duration === d
                        ? "border-[#1C65DA] bg-[#1C65DA]"
                        : "border-[#D5D7DA] bg-white"
                    }`}
                  >
                    {duration === d && (
                      <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                    )}
                  </button>
                  <span className="text-[14px] md:text-[16px] font-semibold text-[#0A0D12]">
                    {d} Days
                  </span>
                </label>
              ))}
            </div>

            {/* ── Return Date ── */}
            <div className="bg-[#F6F9FE] rounded-[12px] px-4 py-4 mb-5 md:mb-6 w-full md:w-[438px] min-h-[92px] md:min-h-[92px] flex flex-col justify-center">
              <p className="text-[14px] md:text-[16px] font-bold text-[#0A0D12] mb-1">
                Return Date
              </p>
              <p className="text-[14px] md:text-[16px] font-medium text-neutral-700 mb-1">
                Please return the book no later than
              </p>
              <p className="text-[14px] md:text-[16px] font-semibold text-[#EE1D52]">
                {formatDate(returnDate)}
              </p>
            </div>

            {/* ── Checkboxes ── */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Agree return */}
              <label className="flex items-start gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setAgreeReturn(!agreeReturn)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    agreeReturn
                      ? "bg-[#1C65DA] border-[#1C65DA]"
                      : "border-[#D5D7DA] bg-white"
                  }`}
                >
                  {agreeReturn && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-[14px] md:text-[16px] font-semibold text-neutral-900 leading-snug">
                  I agree to return the book(s) before the due date.
                </span>
              </label>

              {/* Agree policy */}
              <label className="flex items-start gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setAgreePolicy(!agreePolicy)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    agreePolicy
                      ? "bg-[#1C65DA] border-[#1C65DA]"
                      : "border-[#D5D7DA] bg-white"
                  }`}
                >
                  {agreePolicy && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-[14px] md:text-[16px] font-semibold text-neutral-900 leading-snug">
                  I accept the library borrowing policy.
                </span>
              </label>
            </div>

            {/* ── Confirm & Borrow Button ── */}
            <button
              onClick={() => {
                if (!canConfirm) return;
                borrowMutation.mutate();
              }}
              disabled={!canConfirm || borrowMutation.isPending}
              className={`w-full md:w-[438px] h-[48px] rounded-full font-bold text-[16px] text-white transition-all flex items-center justify-center gap-2 ${
                canConfirm && !borrowMutation.isPending
                  ? "bg-[#1C65DA] hover:bg-[#1550bb] cursor-pointer"
                  : "bg-[#1C65DA]/40 cursor-not-allowed"
              }`}
            >
              {borrowMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Confirm & Borrow"
              )}
            </button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

// ─── Book List Item ────────────────────────────────────────────────────────────

function BookListItem({ item }: { item: CartItem }) {
  return (
    <div className="flex items-start gap-4">
      {/* Cover image */}
      <div className="w-[70px] h-[108px] md:w-[92px] md:h-[138px] rounded-[8px] overflow-hidden flex-shrink-0 bg-neutral-100">
        <img
          src={item.book.coverImage}
          alt={item.book.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 pt-1">
        {/* Category badge */}
        {item.book.category?.name && (
          <span
            className="inline-flex items-center justify-center border border-neutral-300 rounded-sm font-bold text-[14px] text-neutral-700"
            style={{ width: "78px", height: "28px", fontSize: "14px" }}
          >
            {item.book.category.name}
          </span>
        )}
        {/* Book name */}
        <h3 className="text-[16px] md:text-[20px] font-bold text-neutral-900 leading-snug mt-1">
          {item.book.title}
        </h3>
        {/* Author */}
        <p className="text-[14px] md:text-[16px] font-medium text-[#414651]">
          {item.book.author?.name}
        </p>
      </div>
    </div>
  );
}
