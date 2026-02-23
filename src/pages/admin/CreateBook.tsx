import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookApi } from "@/features/books/bookApi";
import { authorApi } from "@/features/authors/authorApi";
import { categoryApi } from "@/features/categories/categoryApi";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema
const createBookSchema = z.object({
  title: z.string().min(2, "Title is required"),
  authorId: z.coerce.number().min(1, "Author is required"),
  categoryId: z.coerce.number().min(1, "Category is required"),
  publishedYear: z.coerce.number().min(1000).max(new Date().getFullYear() + 1),
  isbn: z.string().min(10, "ISBN is required"),
  totalCopies: z.coerce.number().min(1, "At least 1 copy is required"),
  description: z.string().min(10, "Description is required"),
  coverImage: z.string().url("Must be a valid URL"),
});

type CreateBookValues = z.infer<typeof createBookSchema>;

export default function CreateBook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const [authorSearch, setAuthorSearch] = useState("");
  const [isAuthorOpen, setIsAuthorOpen] = useState(false);

  // Fetch Authors and Categories
  const { data: authorsData } = useQuery({
    queryKey: ["authors", authorSearch],
    queryFn: () => authorApi.getAuthors({ search: authorSearch, limit: 10 }), 
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getCategories({ limit: 100 }), 
  });

  // Fetch Book Detail if in Edit Mode
  const { data: bookDetail } = useQuery({
    queryKey: ["book", id],
    queryFn: () => bookApi.getBook(Number(id)),
    enabled: isEditMode,
  });

  const form = useForm<CreateBookValues>({
    resolver: zodResolver(createBookSchema) as any,
    defaultValues: {
      title: "",
      authorId: 0, 
      categoryId: 0,
      publishedYear: new Date().getFullYear(),
      isbn: "",
      totalCopies: 1,
      description: "",
      coverImage: "https://via.placeholder.com/150",
    },
  });

  // Populate form when book detail is loaded
  useEffect(() => {
    if (bookDetail?.data) {
      const book = bookDetail.data;
      form.reset({
        title: book.title,
        authorId: book.authorId,
        categoryId: book.categoryId,
        publishedYear: book.publishedYear,
        isbn: book.isbn,
        totalCopies: book.totalCopies,
        description: book.description,
        coverImage: book.coverImage,
      });
      // Set initial author search text
      if (book.author) {
        setAuthorSearch(book.author.name);
      }
    }
  }, [bookDetail, form]);

  const mutation = useMutation({
    mutationFn: (data: CreateBookValues) => {
       if (isEditMode) {
         return bookApi.updateBook({ id: Number(id), data });
       }
       return bookApi.createBook(data);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Book updated successfully" : "Book created successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      queryClient.invalidateQueries({ queryKey: ["book", id] });
      navigate("/admin/books");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save book");
      setIsLoading(false);
    },
  });

  const onSubmit = (values: CreateBookValues) => {
    setIsLoading(true);
    mutation.mutate(values);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin/books")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Books
      </Button>

      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Book" : "Add New Book"}</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The Great Gatsby" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="authorId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Author</FormLabel>
                    <div className="relative">
                      <Input
                        placeholder="Search author..."
                        value={authorSearch}
                        onChange={(e) => {
                          setAuthorSearch(e.target.value);
                          setIsAuthorOpen(true);
                        }}
                        onFocus={() => setIsAuthorOpen(true)}
                        onBlur={() => setTimeout(() => setIsAuthorOpen(false), 200)}
                      />
                      {isAuthorOpen && authorsData?.data?.authors && (
                        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                           {authorsData.data.authors.length === 0 ? (
                             <div className="p-2 text-sm text-gray-500">No authors found</div>
                           ) : (
                             authorsData.data.authors.map((author) => (
                               <div
                                 key={author.id}
                                 className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                 onClick={() => {
                                   field.onChange(author.id);
                                   setAuthorSearch(author.name);
                                   // setIsAuthorOpen(false); // Handled by blur usually, but keeping it logic clean
                                 }}
                                 onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing before click
                               >
                                 {author.name}
                               </div>
                             ))
                           )}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesData?.data?.categories.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="publishedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value === 0 ? "" : field.value} // Handle 0 for empty input display
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input placeholder="978-3-16-148410-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalCopies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Copies</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value === 0 ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Book summary..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <div className="flex gap-4 items-start">
                       <div className="flex-1">
                          <Input placeholder="https://..." {...field} />
                       </div>
                       {field.value && (
                         <div className="w-20 h-28 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <img src={field.value} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                       )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                isEditMode ? "Update Book" : "Save Book"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
