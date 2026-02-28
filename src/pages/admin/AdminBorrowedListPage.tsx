// High-Fidelity Admin Borrowed List Page
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loanApi } from "@/features/loans/loanApi";
import AdminPanelLayout from "@/layouts/AdminPanelLayout";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";
import type { Loan } from "@/types/loan";

const STATUS_TABS = ["All", "Active", "Returned", "Overdue"] as const;
const LIMIT = 10;

function BorrowedCard({ loan }: { loan: Loan }) {
  const label = loan.displayStatus ?? loan.status;
  const name = loan.borrower?.name ?? loan.user?.name ?? "—";
  const durationDays = dayjs(loan.dueAt).diff(dayjs(loan.borrowedAt), "day");

  return (
    <div className="bg-white rounded-[16px] shadow-[0px_20px_20px_0px_rgba(203,202,202,0.25)] border border-[#EAECF0] p-5 mb-6 w-full md:h-[250px] flex flex-col justify-between">
      {/* Upper Section: Status & Due Date */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <span className="text-[14px] md:text-[16px] font-bold text-[#0A0D12]">Status</span>
          <div 
            className={`flex items-center justify-center h-8 rounded-[4px] text-[14px] md:text-[16px] font-bold text-white ${
              label === "Active" ? "bg-[#24A500]" : 
              label === "Returned" ? "bg-[#1C65DA]" : 
              "bg-[#EE1D52]"
            }`}
            style={{ width: '56px' }}
          >
            {label === "Active" ? "Active" : label === "Returned" ? "Returned" : "Overdue"}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[14px] md:text-[16px] font-bold text-[#0A0D12]">Due Date</span>
          <div className="flex items-center justify-center h-8 px-4 rounded-[4px] bg-[#EE1D52]/10 border border-[#EE1D52] text-[14px] md:text-[16px] text-[#EE1D52] font-bold" style={{ minWidth: '116px' }}>
            {dayjs(loan.dueAt).format("DD MMMM YYYY")}
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="border-t border-[#F2F4F7] mb-5 w-full"></div>

      {/* Main Info Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-0">
        <div className="flex flex-col md:flex-row gap-5 flex-1">
          {/* Book Image */}
          <div className="w-[92px] h-[138px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-[#EAECF0]">
            {loan.book?.coverImage ? (
              <img src={loan.book.coverImage} alt={loan.book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center justify-center h-7 px-3 border border-[#D5D7DA] rounded-sm text-[18px] font-bold text-[#0A0D12] mb-1.5 w-fit">
              {loan.book?.category?.name ?? "Category"}
            </div>
            <h3 className="text-[20px] font-bold text-[#0A0D12] mb-1 leading-tight line-clamp-1">{loan.book?.title ?? "Book Name"}</h3>
            <p className="text-[16px] font-medium text-[#414651] mb-2">{loan.book?.author?.name ?? "Author Name"}</p>
            <p className="text-[16px] font-bold text-[#0A0D12]">
              {dayjs(loan.borrowedAt).format("DD MMM YYYY")} &nbsp;·&nbsp; Duration {durationDays} Days
            </p>
          </div>
        </div>

        {/* Borrower Info Section */}
        <div className="flex flex-col justify-center md:text-right">
          <p className="text-[16px] font-semibold text-[#667085] mb-1">borrower's name</p>
          <p className="text-[20px] font-bold text-[#0A0D12]">{name}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminBorrowedListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-loans-new", page, search, status],
    queryFn: () =>
      loanApi.getLoans({
        page,
        limit: LIMIT,
        search: search || undefined,
        status: status === "All" ? undefined : status,
      }),
  });

  const loans = data?.data?.loans ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  function pageNumbers(): (number | "…")[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums: (number | "…")[] = [1];
    if (page > 3) nums.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
    if (page < totalPages - 2) nums.push("…");
    nums.push(totalPages);
    return nums;
  }

  return (
    <AdminPanelLayout>
      <div className="w-full mx-auto px-4 md:px-10">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#0A0D12] mb-6">Borrowed List</h1>

        {/* Controls: Search & Tabs */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Search bar */}
          <div className="relative w-full md:max-w-[600px] h-[48px]">
            <img 
              src="/assets/search.png" 
              alt="Search" 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] object-contain" 
            />
            <input
              type="text"
              placeholder="Search book title or author"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full h-full pl-11 pr-4 rounded-full border border-[#D5D7DA] text-[14px] font-medium placeholder:text-[#98A2B3] focus:outline-none focus:border-[#1C65DA]"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex gap-3 flex-wrap">
            {STATUS_TABS.map((tab) => {
              const isActive = status === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setStatus(tab); setPage(1); }}
                  className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all border ${
                    isActive
                      ? "border-[#1C65DA] text-[#1C65DA]"
                      : "border-[#D5D7DA] text-[#667085] hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#1C65DA]" />
          </div>
        ) : loans.length === 0 ? (
          <div className="py-20 text-center text-lg text-[#667085] bg-white rounded-2xl border border-dashed border-gray-300">
            No borrowed records found for "{status}"
          </div>
        ) : (
          <div>
            {loans.map((loan) => (
              <BorrowedCard key={loan.id} loan={loan} />
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-10 mb-20">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-semibold text-[#667085] disabled:opacity-30"
                >
                  &lt; Previous
                </button>
                {pageNumbers().map((pg, idx) =>
                  pg === "…" ? (
                    <span key={`e${idx}`} className="px-2 text-sm text-[#667085]">…</span>
                  ) : (
                    <button
                      key={pg}
                      onClick={() => setPage(pg as number)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
                        page === pg ? "bg-[#1C65DA] text-white" : "text-[#667085] hover:bg-gray-100"
                      }`}
                    >
                      {pg}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 text-sm font-semibold text-[#667085] disabled:opacity-30"
                >
                  Next &gt;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminPanelLayout>
  );
}
