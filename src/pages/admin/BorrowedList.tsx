// Admin Borrowed List Page
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loanApi } from "@/features/loans/loanApi";
import { Loader2, Search } from "lucide-react";
import dayjs from "dayjs";

const STATUS_TABS = ["All", "Active", "Overdue", "Returned"] as const;
const LIMIT = 10;

function getStatusStyle(displayStatus: string) {
  switch (displayStatus) {
    case "Active":   return "bg-green-50 text-green-700 border border-green-200";
    case "Returned": return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Overdue":  return "bg-red-50 text-red-700 border border-red-200";
    default:         return "bg-gray-100 text-gray-600 border border-gray-200";
  }
}

export default function BorrowedList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-loans", page, search, status],
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
  const total = pagination?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, total);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleTabChange(tab: string) {
    setStatus(tab);
    setPage(1);
  }

  // Build page number array (show max 5 pages centered around current)
  function getPageNumbers() {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="font-quicksand">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-[#0A0D12] mb-6">Borrowed List</h1>

      {/* Search + Status Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        {/* Status Tabs */}
        <div className="flex gap-1 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                status === tab
                  ? "bg-[#1C65DA] text-white"
                  : "bg-transparent text-[#667085] hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#667085]" />
          <input
            type="text"
            placeholder="Search here"
            value={search}
            onChange={handleSearchChange}
            className="w-full h-10 pl-9 pr-4 rounded-[10px] border border-[#D0D5DD] text-sm text-[#0A0D12] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#1C65DA] focus:ring-1 focus:ring-[#1C65DA]"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-[#F2F4F7] rounded-2xl overflow-hidden shadow-sm">
        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#1C65DA]" />
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center py-20 text-[#667085] text-sm">
            No borrowed books found.
          </div>
        ) : (
          <>
            {/* === DESKTOP TABLE === */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F2F4F7]">
                    <th className="text-left text-[#667085] font-semibold px-6 py-4 w-12">No</th>
                    <th className="text-left text-[#667085] font-semibold px-4 py-4">Borrower</th>
                    <th className="text-left text-[#667085] font-semibold px-4 py-4">Book Title</th>
                    <th className="text-left text-[#667085] font-semibold px-4 py-4">Status</th>
                    <th className="text-left text-[#667085] font-semibold px-4 py-4">Borrowed At</th>
                    <th className="text-left text-[#667085] font-semibold px-4 py-4">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan, idx) => {
                    const label = loan.displayStatus ?? loan.status;
                    const borrowerName = loan.borrower?.name ?? loan.user?.name ?? "—";
                    return (
                      <tr
                        key={loan.id}
                        className="border-b border-[#F2F4F7] last:border-b-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-[#0A0D12] font-medium">
                          {from + idx}
                        </td>
                        <td className="px-4 py-4 text-[#0A0D12] font-medium">
                          {borrowerName}
                        </td>
                        <td className="px-4 py-4 text-[#0A0D12] max-w-[220px]">
                          <span className="line-clamp-2">{loan.book?.title ?? "—"}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(label)}`}
                          >
                            {label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[#667085]">
                          {dayjs(loan.borrowedAt).format("DD MMM YYYY, HH:mm")}
                        </td>
                        <td className={`px-4 py-4 font-medium ${label === "Overdue" ? "text-red-600" : "text-[#0A0D12]"}`}>
                          {dayjs(loan.dueAt).format("DD MMM YYYY")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* === MOBILE CARDS === */}
            <div className="md:hidden divide-y divide-[#F2F4F7]">
              {loans.map((loan, idx) => {
                const label = loan.displayStatus ?? loan.status;
                const borrowerName = loan.borrower?.name ?? loan.user?.name ?? "—";
                return (
                  <div key={loan.id} className="px-5 py-4 space-y-3">
                    {/* Row header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#667085]">#{from + idx}</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(label)}`}>
                        {label}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#0A0D12] text-base line-clamp-2">
                      {loan.book?.title ?? "—"}
                    </h3>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                      <span className="text-[#667085]">Borrower</span>
                      <span className="font-semibold text-[#0A0D12] text-right">{borrowerName}</span>
                      <span className="text-[#667085]">Borrowed At</span>
                      <span className="font-medium text-[#0A0D12] text-right">
                        {dayjs(loan.borrowedAt).format("DD MMM YYYY, HH:mm")}
                      </span>
                      <span className="text-[#667085]">Due Date</span>
                      <span className={`font-medium text-right ${label === "Overdue" ? "text-red-600" : "text-[#0A0D12]"}`}>
                        {dayjs(loan.dueAt).format("DD MMM YYYY")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* === PAGINATION FOOTER === */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#F2F4F7]">
              <span className="text-sm text-[#667085]">
                Showing {from} to {to} of {total} entries
              </span>
              <div className="flex items-center gap-1">
                {/* Previous */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm text-[#667085] rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  &lt; Previous
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((pg, i) =>
                  pg === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm text-[#667085]">
                      ...
                    </span>
                  ) : (
                    <button
                      key={pg}
                      onClick={() => setPage(pg as number)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                        page === pg
                          ? "bg-[#1C65DA] text-white"
                          : "text-[#667085] hover:bg-gray-100"
                      }`}
                    >
                      {pg}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 text-sm text-[#667085] rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
