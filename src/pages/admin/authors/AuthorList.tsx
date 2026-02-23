import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { authorApi } from "@/features/authors/authorApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function AuthorList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch Authors
  const { data, isLoading } = useQuery({
    queryKey: ["authors", page, search],
    queryFn: () => authorApi.getAuthors({ page, search }),
  });

  // Delete Author Mutation
  const deleteMutation = useMutation({
    mutationFn: authorApi.deleteAuthor,
    onSuccess: () => {
      toast.success("Author deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete author");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this author?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Authors</h1>
        <Link to="/admin/authors/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Author
          </Button>
        </Link>
      </div>

      {/* Filter / Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search authors..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead>Books</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.data.authors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No authors found
                </TableCell>
              </TableRow>
            ) : (
              data?.data.authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>
                    <img
                      src={author.photo || "https://via.placeholder.com/40"}
                      alt={author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{author.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{author.bio}</TableCell>
                  <TableCell>{author.bookCount || 0}</TableCell>
                  <TableCell>{dayjs(author.createdAt).format("DD MMM YYYY")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/authors/edit/${author.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(author.id)}
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
      
      {/* Pagination (Simple) */}
       <div className="flex justify-end mt-4 gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={!data?.pagination || page >= data.pagination.totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
