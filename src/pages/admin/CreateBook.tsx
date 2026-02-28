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
  publishedYear: z.coerce.number().min(1000, "Invalid year").max(new Date().getFullYear() + 1, "Invalid year"),
  isbn: z.string().min(6, "ISBN must be at least 6 digits").regex(/^\d+$/, "ISBN must contain only numbers"),
  totalCopies: z.coerce.number().min(1, "At least 1 copy is required"),
  description: z.string().min(1, "Description is required"),
  coverImage: z.union([z.literal(""), z.string().trim().url("Must be a valid URL")]).optional(),
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

  const createAuthorMutation = useMutation({
    mutationFn: (name: string) => authorApi.createAuthor({ name, bio: "", photo: "" }),
    onSuccess: (response) => {
      const newAuthor = response.data;
      if (newAuthor) {
        setAuthorSearch(newAuthor.name);
        form.setValue("authorId", newAuthor.id);
        toast.success(`Author "${newAuthor.name}" created!`);
        setIsAuthorOpen(false);
        queryClient.invalidateQueries({ queryKey: ["authors"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create author");
    }
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
      publishedYear: "" as unknown as number,
      isbn: "",
      totalCopies: "" as unknown as number,
      description: "",
      coverImage: "",
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
       const payload = { ...data, coverImage: data.coverImage || "" };
       if (isEditMode) {
         return bookApi.updateBook({ id: Number(id), data: payload });
       }
       return bookApi.createBook(payload);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Book updated successfully" : "Add Success", {
        style: {
          backgroundColor: "#16a34a",
          color: "white",
          border: "none",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      queryClient.invalidateQueries({ queryKey: ["admin-books-highfi"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-books"] });
      queryClient.invalidateQueries({ queryKey: ["book", id] });
      navigate("/admin/books");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save book");
      setIsLoading(false);
    },
  });

  const onSubmit = (values: CreateBookValues) => {
    console.log("Submitting values:", values);
    setIsLoading(true);
    mutation.mutate(values);
  };

  const onInvalid = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin/books")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Books
      </Button>

      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Book" : "Add New Book"}</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                        value={authorSearch}
                        onChange={(e) => {
                          setAuthorSearch(e.target.value);
                          setIsAuthorOpen(true);
                          form.setValue("authorId", 0);
                        }}
                        onFocus={() => setIsAuthorOpen(true)}
                        onBlur={() => setTimeout(() => setIsAuthorOpen(false), 200)}
                      />
                      {isAuthorOpen && (
                        <div className="absolute z-50 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                           {authorsData?.data?.authors?.map((author) => (
                             <div
                               key={author.id}
                               className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                               onClick={() => {
                                 field.onChange(author.id);
                                 setAuthorSearch(author.name);
                                 setIsAuthorOpen(false);
                               }}
                               onMouseDown={(e) => e.preventDefault()}
                             >
                               {author.name}
                             </div>
                           ))}
                           {authorSearch.length > 0 && !authorsData?.data?.authors?.some(a => a.name.toLowerCase() === authorSearch.toLowerCase()) && (
                             <div 
                               onMouseDown={(e) => e.preventDefault()}
                               onClick={() => {
                                 if (!createAuthorMutation.isPending) {
                                    createAuthorMutation.mutate(authorSearch);
                                 }
                               }}
                               className="p-2 hover:bg-blue-50 cursor-pointer text-sm font-bold text-blue-600 border-t flex items-center justify-between"
                             >
                               <span>+ Add "{authorSearch}"</span>
                               {createAuthorMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                             </div>
                           )}
                           {authorsData?.data?.authors?.length === 0 && authorSearch.length === 0 && (
                             <div className="p-2 text-sm text-gray-500">Type to search or create an author</div>
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
                      <SelectContent className="bg-white">
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
                    <FormLabel>Year Publish</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <Input {...field} />
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
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <Textarea {...field} />
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
                          <Input {...field} />
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
