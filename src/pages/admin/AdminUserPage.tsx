// High-Fidelity Admin User Page
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/features/users/userApi";
import AdminPanelLayout from "@/layouts/AdminPanelLayout";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

const LIMIT = 10;

export default function AdminUserPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users-new", page, search],
    queryFn: () => userApi.getUsers({ page, limit: LIMIT, search: search || undefined }),
  });

  const users = data?.data?.users ?? [];
  const pagination = data?.data?.pagination;
  const totalEntries = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const from = totalEntries === 0 ? 0 : (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, totalEntries);

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
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#0A0D12] mb-6">User</h1>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative w-full md:max-w-[600px] h-[48px]">
            <img 
              src="/assets/search.png" 
              alt="Search" 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] object-contain" 
            />
            <input
              type="text"
              placeholder="Search user"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full h-full pl-11 pr-4 rounded-full border border-[#D5D7DA] text-[14px] font-medium placeholder:text-[#98A2B3] focus:outline-none focus:border-[#1C65DA]"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white border border-[#EAECF0] rounded-[16px] overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#1C65DA]" /></div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-sm text-[#667085]">No users found.</div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-[#F9FAFB] border-b border-[#EAECF0]">
                  <tr>
                    {["No", "Name", "Nomor Handphone", "Email", "Created at"].map((h) => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-[#667085] uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7]">
                  {users.map((user, i) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-[#667085] font-medium">{from + i}</td>
                      <td className="px-6 py-5 font-bold text-[#0A0D12]">{user.name}</td>
                      <td className="px-6 py-5 text-[#414651] font-medium">{user.phone ?? "—"}</td>
                      <td className="px-6 py-5 text-[#414651] font-medium">{user.email}</td>
                      <td className="px-6 py-5 text-[#667085] font-medium">
                        {user.createdAt ? dayjs(user.createdAt).format("DD MMM YYYY, HH:mm") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Desktop */}
              <div className="flex items-center justify-between px-6 py-5 border-t border-[#EAECF0]">
                <span className="text-sm text-[#667085]">Showing {from} to {to} of {totalEntries} entries</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#414651] disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  {pageNumbers().map((pg, idx) => (
                    pg === "…" ? <span key={idx} className="px-2">…</span> :
                    <button 
                      key={pg} 
                      onClick={() => setPage(pg as number)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${
                        page === pg ? "bg-[#1C65DA] text-white" : "text-[#717680] hover:bg-gray-100"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                    disabled={page >= totalPages}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#414651] disabled:opacity-30"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 pb-20">
          {isLoading ? (
            <div className="flex justify-center py-20 text-[#1C65DA]"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-[#667085]">No users found.</div>
          ) : (
            <>
              {users.map((user, i) => (
                <div key={user.id} className="bg-white border border-[#EAECF0] rounded-[12px] p-5 space-y-4 shadow-sm">
                  {[
                    ["No", from + i],
                    ["Name", user.name],
                    ["Email", user.email],
                    ["Nomor Handphone", user.phone ?? "—"],
                    ["Created at", user.createdAt ? dayjs(user.createdAt).format("DD MMM YYYY, HH:mm") : "—"],
                  ].map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start gap-4 text-[14px]">
                      <span className="text-[#667085] font-medium">{key}</span>
                      <span className="text-[#0A0D12] font-bold text-right">{value}</span>
                    </div>
                  ))}
                </div>
              ))}

              {/* Pagination Mobile */}
              <div className="flex flex-col items-center gap-4 pt-4">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={page === 1}
                    className="p-2 text-[#414651] disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {pageNumbers().map((pg, idx) => (
                    pg === "…" ? <span key={idx} className="px-2">…</span> :
                    <button 
                      key={pg} 
                      onClick={() => setPage(pg as number)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${
                        page === pg ? "bg-[#1C65DA] text-white" : "text-[#717680] hover:bg-gray-100"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                    disabled={page >= totalPages}
                    className="p-2 text-[#414651] disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-[#667085]">Showing {from} to {to} of {totalEntries} entries</span>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminPanelLayout>
  );
}
