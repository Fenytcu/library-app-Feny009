import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/features/users/userApi";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { GiveReviewModal } from "@/components/GiveReviewModal";
import { Loader2, Search } from "lucide-react";
import type { MyLoan } from "@/types/user";
import dayjs from "dayjs";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function formatShortDate(dateStr: string): string {
  return dayjs(dateStr).format("DD MMM YYYY");
}

type FilterType = "All" | "Active" | "Returned" | "Overdue";

function getDisplayStatus(loan: MyLoan): { label: string; color: string } {
  if (loan.status === "RETURNED") return { label: "Returned", color: "text-green-600" };
  if (loan.status === "OVERDUE") return { label: "Overdue", color: "text-red-500" };
  return { label: "Active", color: "text-green-600" };
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function BorrowedList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [visibleCount, setVisibleCount] = useState(5);

  // ── Review Modal State ──
  const [reviewModal, setReviewModal] = useState<{ open: boolean; bookId: number; bookTitle: string }>({
    open: false,
    bookId: 0,
    bookTitle: "",
  });

  const openReviewModal = (bookId: number, bookTitle: string) => {
    setReviewModal({ open: true, bookId, bookTitle });
  };

  // ── Data ──
  const { data: loansData, isLoading: loansLoading } = useQuery({
    queryKey: ["my-loans"],
    queryFn: () => userApi.getMyLoans(),
  });

  const allLoans: MyLoan[] = loansData?.data?.loans ?? [];

  // ── Filter & Search ──
  const filteredLoans = useMemo(() => {
    return allLoans.filter((loan) => {
      const { label } = getDisplayStatus(loan);
      const matchesFilter =
        filter === "All" ||
        (filter === "Active" && label === "Active") ||
        (filter === "Returned" && label === "Returned") ||
        (filter === "Overdue" && label === "Overdue");

      const matchesSearch = search
        ? loan.book.title.toLowerCase().includes(search.toLowerCase())
        : true;

      return matchesFilter && matchesSearch;
    });
  }, [allLoans, filter, search]);

  const visibleLoans = filteredLoans.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLoans.length;

  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand flex flex-col">
      <LandingNavbar />

      <main className="flex-1 container mx-auto px-4 md:px-10 py-6 md:py-10 max-w-[1000px]">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#0A0D12] mb-5">
          Borrowed List
        </h1>

        {/* Search */}
        <div className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-2 bg-white mb-4 w-full">
          <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search book"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(5); }}
            className="flex-1 text-[14px] outline-none bg-transparent text-neutral-800 placeholder:text-neutral-400"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["All", "Active", "Returned", "Overdue"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setVisibleCount(5); }}
              className={`px-4 py-1.5 rounded-full text-[13px] md:text-[14px] font-semibold border transition-colors ${
                filter === f
                  ? "bg-[#EBF1FB] border-[#1C65DA] text-[#1C65DA]"
                  : "border-neutral-300 text-neutral-600 bg-white hover:border-neutral-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Loan Cards */}
        {loansLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : visibleLoans.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 font-medium">
            No borrowed books found.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visibleLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onReview={() => openReviewModal(loan.book.id, loan.book.title)}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((c) => c + 5)}
              className="h-[44px] px-10 rounded-full border border-neutral-300 text-[14px] md:text-[16px] font-semibold text-neutral-700 hover:border-neutral-500 transition-colors bg-white"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      <LandingFooter />

      {/* Give Review Modal */}
      <GiveReviewModal
        key={reviewModal.bookId}
        bookId={reviewModal.bookId}
        bookTitle={reviewModal.bookTitle}
        isOpen={reviewModal.open}
        onClose={() => setReviewModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}

// ─── Loan Card ─────────────────────────────────────────────────────────────────

function LoanCard({ loan, onReview }: { loan: MyLoan; onReview: () => void }) {
  const { label, color } = getDisplayStatus(loan);

  return (
    <div className="bg-white border border-neutral-200 rounded-[16px] p-4 md:p-5 flex flex-col gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">

      {/* ── Row 1: Status + Due Date ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[13px] md:text-[14px]">
          <span className="font-medium text-neutral-500">Status</span>
          <span className={`font-bold ${color}`}>{label}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] md:text-[14px]">
          <span className="font-medium text-neutral-500">Due Date</span>
          <span className="font-semibold px-2 py-0.5 rounded bg-[#FFF0F3] text-[#EE1D52]">
            {formatDate(loan.dueAt)}
          </span>
        </div>
      </div>

      {/* ── Row 2: Book info + button (desktop side-by-side, mobile stacked) ── */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4">

        {/* Book info: cover + text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Cover */}
          <div className="w-[64px] h-[88px] md:w-[80px] md:h-[108px] rounded-[8px] overflow-hidden flex-shrink-0 bg-neutral-100">
            <img
              src={loan.book.coverImage}
              alt={loan.book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text details */}
          <div className="flex flex-col gap-1 flex-1 min-w-0 py-1">
            {loan.book.category?.name && (
              <span className="inline-flex items-center border border-neutral-300 rounded text-[11px] md:text-[12px] font-semibold text-neutral-600 px-2 py-0.5 w-fit">
                {loan.book.category.name}
              </span>
            )}
            <h3 className="text-[15px] md:text-[17px] font-bold text-[#0A0D12] leading-snug line-clamp-2">
              {loan.book.title}
            </h3>
            {loan.book.author?.name && (
              <p className="text-[13px] md:text-[14px] font-medium text-[#414651]">
                {loan.book.author.name}
              </p>
            )}
            <p className="text-[12px] md:text-[13px] font-medium text-neutral-400 mt-0.5">
              {formatShortDate(loan.borrowedAt)}
              {loan.durationDays ? ` · Duration ${loan.durationDays} Days` : ""}
            </p>
          </div>
        </div>

        {/* Give Review button — right on desktop, full-width on mobile */}
        <button
          onClick={onReview}
          className="mt-3 md:mt-0 w-full md:w-[140px] lg:w-[160px] h-[44px] flex-shrink-0 rounded-full bg-[#1C65DA] hover:bg-[#1550bb] text-white font-bold text-[14px] transition-colors"
        >
          Give Review
        </button>
      </div>
    </div>
  );
}
