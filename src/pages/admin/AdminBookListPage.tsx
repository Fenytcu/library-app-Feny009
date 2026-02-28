// High-Fidelity Admin Book List Page
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookApi } from "@/features/books/bookApi";
import AdminPanelLayout from "@/layouts/AdminPanelLayout";
import { Loader2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { Book } from "@/types/book";

import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

const STATUS_TABS = ["All", "Available", "Borrowed", "Returned"] as const;
const LIMIT = 10;

function BookListItem({ book }: { book: Book }) {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => bookApi.deleteBook(id),
    onSuccess: () => {
      toast.success("Book deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-books-highfi"] });
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-books"] });
      setIsDeleteModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete book");
    }
  });

  const handleDelete = () => {
    deleteMutation.mutate(book.id);
  };

  return (
    <>
      <div className="bg-white rounded-[16px] shadow-[0px_20px_20px_0px_rgba(203,202,202,0.25)] border border-[#EAECF0] p-5 mb-6 w-full flex flex-col md:flex-row items-center gap-6">
        {/* Cover */}
        <div className="w-[92px] h-[138px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-[#EAECF0]">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center text-center md:text-left">
          <div className="inline-flex items-center justify-center h-7 px-3 border border-[#D5D7DA] rounded-sm text-[14px] font-bold text-[#0A0D12] mb-2 w-fit mx-auto md:mx-0">
            {book.category?.name ?? "Category"}
          </div>
          <h3 className="text-[20px] font-bold text-[#0A0D12] mb-1 leading-tight line-clamp-1">{book.title}</h3>
          <p className="text-[16px] font-medium text-[#414651] mb-2">{book.author?.name ?? "Author Name"}</p>
          <div className="flex items-center justify-center md:justify-start gap-1">
            <Star className="w-4 h-4 fill-[#FDB022] text-[#FDB022]" />
            <span className="text-[14px] font-bold text-[#0A0D12]">{book.rating ?? "4.9"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link 
            to={`/admin/book-list/detail/${book.id}`}
            className="flex items-center justify-center h-10 px-5 rounded-full border border-[#D5D7DA] text-[14px] font-bold text-[#0A0D12] hover:bg-gray-50 transition-colors"
          >
            Preview
          </Link>
          <Link 
            to={`/admin/book-list/edit/${book.id}`}
            className="flex items-center justify-center h-10 px-5 rounded-full border border-[#D5D7DA] text-[14px] font-bold text-[#0A0D12] hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteMutation.isPending}
            className="flex items-center justify-center h-10 px-5 rounded-full border border-[#D5D7DA] text-[14px] font-bold text-[#EE1D52] hover:bg-red-50 transition-colors disabled:opacity-30"
          >
            {deleteMutation.isPending ? "..." : "Delete"}
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}

export default function AdminBookListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-books-highfi", page, search, status],
    queryFn: () =>
      bookApi.getAdminBooks({
        page,
        limit: LIMIT,
        search: search || undefined,
        // Since the current API doesn't support status as a param for bookApi.getAdminBooks in the same way,
        // we'll handle filtering logic if needed locally OR if the API supports it.
        // Assuming search/pagination is the priority for now.
      }),
  });

  const books = data?.data?.books ?? [];
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
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#0A0D12] mb-6">Book List</h1>

        {/* Top Button */}
        <div className="mb-6">
          <Link 
            to="/admin/book-list/create"
            className="inline-flex items-center justify-center h-12 px-8 bg-[#1C65DA] text-white rounded-lg text-[16px] font-bold hover:bg-blue-700 transition-colors"
          >
            Add Book
          </Link>
        </div>

        {/* Controls: Search & Tabs */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="relative w-full md:max-w-[600px] h-[48px]">
            <img 
              src="/assets/search.png" 
              alt="Search" 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] object-contain" 
            />
            <input
              type="text"
              placeholder="Search book"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full h-full pl-11 pr-4 rounded-full border border-[#D5D7DA] text-[14px] font-medium placeholder:text-[#98A2B3] focus:outline-none focus:border-[#1C65DA]"
            />
          </div>

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
          <div className="flex justify-center py-20 text-[#1C65DA]">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="py-20 text-center text-lg text-[#667085] bg-white rounded-2xl border border-dashed border-gray-300">
            No books found.
          </div>
        ) : (
          <div className="pb-20">
            {books.map((book) => (
              <BookListItem key={book.id} book={book} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10">
                <span className="text-[14px] font-medium text-[#667085]">
                  Showing {from} to {to} of {totalEntries} entries
                </span>
                <div className="flex justify-center items-center gap-1.5">
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
              </div>
            )}
          </div>
        )}
      </div>
    </AdminPanelLayout>
  );
}
