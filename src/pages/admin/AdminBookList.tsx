import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookApi } from "@/features/books/bookApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Search, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BookDetailModal } from "@/features/books/BookDetailModal";

export default function AdminBookList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch books
  const { data, isLoading } = useQuery({
    queryKey: ['admin-books', page, search],
    queryFn: () => bookApi.getAdminBooks({ page, search, limit: 10 }),
  });

  // Fetch single book detail
  const { data: bookDetail } = useQuery({
    queryKey: ['book-detail', selectedBookId],
    queryFn: () => bookApi.getBook(selectedBookId!),
    enabled: !!selectedBookId && isModalOpen,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: bookApi.deleteBook,
    onSuccess: () => {
      toast.success("Book deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      queryClient.invalidateQueries({ queryKey: ['admin-books-highfi'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['recommended-books'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete book");
      console.error(error);
    }
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (id: number) => {
    setSelectedBookId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBookId(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on search
    // Trigger refetch via key change
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-quicksand">Book List</h1>
        <Link to="/admin/books/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-2">
           {['All', 'Available', 'Borrowed', 'Returned'].map((tab) => (
             <Button
               key={tab}
               variant={tab === 'All' ? 'default' : 'ghost'}
               className={`rounded-full h-8 px-4 ${tab === 'All' ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-500'}`}
             >
               {tab}
             </Button>
           ))}
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search book" 
            className="pl-9 w-full sm:w-[300px] rounded-full border-gray-200 bg-gray-50/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Book Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.data?.books?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  No books found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.books?.map((book) => (
                <TableRow key={book.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="h-16 w-12 rounded overflow-hidden bg-gray-100">
                      <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-neutral-900">{book.title}</span>
                      <span className="text-xs text-gray-500">{book.isbn}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                      {book.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-700">{book.author.name}</TableCell>
                  <TableCell>
                    {book.availableCopies > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                        Out of Stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleView(book.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                        onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(book.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination (Simplified) */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data?.data?.pagination?.total || 0)} of {data?.data?.pagination?.total} entries</span>
        <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => p + 1)}
              disabled={page >= (data?.data?.pagination?.totalPages || 1)}
            >
              Next
            </Button>
        </div>
      </div>

      {/* Book Detail Modal */}
      <BookDetailModal 
        book={bookDetail?.data || null} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}
