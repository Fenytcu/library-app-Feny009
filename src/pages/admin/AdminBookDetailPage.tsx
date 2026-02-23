import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookApi } from "@/features/books/bookApi";
import AdminPanelLayout from "@/layouts/AdminPanelLayout";
import { Loader2, ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

export default function AdminBookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: bookData, isLoading, error } = useQuery({
    queryKey: ["admin-book", bookId],
    queryFn: () => bookApi.getBook(bookId),
    enabled: !!bookId,
  });

  const book = bookData?.data;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => bookApi.deleteBook(id),
    onSuccess: () => {
      toast.success("Book deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-books-highfi"] });
      navigate("/admin/book-list");
    },
    onError: () => {
      toast.error("Failed to delete book");
    }
  });

  const handleDelete = () => {
    deleteMutation.mutate(bookId);
  };

  if (isLoading) {
    return (
      <AdminPanelLayout>
        <div className="flex justify-center items-center py-40">
          <Loader2 className="h-10 w-10 animate-spin text-[#1C65DA]" />
        </div>
      </AdminPanelLayout>
    );
  }

  if (error || !book) {
    return (
      <AdminPanelLayout>
        <div className="text-center py-40">
          <p className="text-red-500 font-bold mb-4">Error loading book details.</p>
          <Link to="/admin/book-list" className="text-[#1C65DA] hover:underline">Back to Book List</Link>
        </div>
      </AdminPanelLayout>
    );
  }

  return (
    <AdminPanelLayout>
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 pb-20 mt-10">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/admin/book-list" 
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#EAECF0] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A0D12]" />
          </Link>
          <h1 className="text-[24px] font-bold text-[#0A0D12]">Preview Book</h1>
        </div>

        <div className="bg-white rounded-[16px] border border-[#EAECF0] overflow-hidden shadow-sm">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column: Book Cover */}
            <div className="w-full lg:w-[416px] bg-[#F2F4F7] p-8 lg:p-12 flex items-center justify-center">
              <div className="w-full max-w-[317px] aspect-[317/480] bg-white rounded-lg shadow-2xl overflow-hidden border border-[#EAECF0]">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[#667085] font-medium italic">No Cover</div>
                )}
              </div>
            </div>

            {/* Right Column: Book Details */}
            <div className="flex-1 p-8 lg:p-12">
              <div className="inline-flex items-center px-3 py-1 bg-white border border-[#EAECF0] rounded-[6px] text-[14px] font-medium text-[#344054] mb-6 shadow-sm">
                {book.category?.name}
              </div>

              <h2 className="text-[36px] font-bold text-[#0A0D12] mb-3 leading-tight">
                {book.title}
              </h2>

              <p className="text-[20px] font-bold text-[#667085] mb-8">
                {book.author?.name}
              </p>

              {/* Stats Section */}
              <div className="flex items-center gap-8 md:gap-12 mb-10 border-b border-[#F2F4F7] pb-10">
                <div className="text-left">
                  <p className="text-[24px] font-bold text-[#0A0D12] leading-none mb-2">320</p>
                  <p className="text-[14px] font-medium text-[#667085]">Page</p>
                </div>
                
                <div className="w-px h-10 bg-[#EAECF0]" />

                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2 leading-none">
                    <Star className="w-5 h-5 fill-[#FDB022] text-[#FDB022]" />
                    <span className="text-[24px] font-bold text-[#0A0D12]">{book.rating || "4.9"}</span>
                  </div>
                  <p className="text-[14px] font-medium text-[#667085]">Rating</p>
                </div>

                <div className="w-px h-10 bg-[#EAECF0]" />

                <div className="text-left">
                  <p className="text-[24px] font-bold text-[#0A0D12] leading-none mb-2">{book.reviewCount || "179"}</p>
                  <p className="text-[14px] font-medium text-[#667085]">Reviews</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[18px] font-bold text-[#0A0D12]">Description</h3>
                <p className="text-[16px] text-[#414651] leading-relaxed">
                  {book.description || "The Psychology of Money explores how emotions, biases, and human behavior shape the way we think about money, investing, and financial decisions. Morgan Housel shares timeless lessons on wealth, greed, and happiness, showing that financial success is not about knowledge, but about behavior."}
                </p>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <Link 
                  to={`/admin/book-list/edit/${book.id}`}
                  className="flex-1 flex items-center justify-center h-12 border border-[#D0D5DD] bg-white text-[#344054] rounded-lg font-bold hover:bg-gray-50 transition-colors text-[16px]"
                >
                  Edit Book
                </Link>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 flex items-center justify-center h-12 bg-[#1C65DA] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 text-[16px]"
                >
                  {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </AdminPanelLayout>
  );
}
