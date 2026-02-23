import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorApi } from "@/features/authors/authorApi";
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
import { Textarea } from "@/components/ui/textarea"; // Ensure this exists from previous steps
import { ArrowLeft } from "lucide-react";

// Schema
const authorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  bio: z.string().min(10, "Bio is required"),
  photo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
});

type AuthorFormValues = z.infer<typeof authorSchema>;

export default function CreateAuthor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: "",
      bio: "",
      photo: "",
      birthDate: "",
      deathDate: "",
    },
  });

  // Fetch Author if Editing
  const { data: authorData } = useQuery({
    queryKey: ["author", id],
    queryFn: () => authorApi.getAuthor(Number(id)),
    enabled: isEditing,
  });

  useEffect(() => {
    if (authorData?.data) {
      form.reset({
        name: authorData.data.name,
        bio: authorData.data.bio,
        photo: authorData.data.photo || "",
        birthDate: authorData.data.birthDate ? authorData.data.birthDate.split('T')[0] : "",
        deathDate: authorData.data.deathDate ? authorData.data.deathDate.split('T')[0] : "",
      });
    }
  }, [authorData, form]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: authorApi.createAuthor,
    onSuccess: () => {
      toast.success("Author created successfully");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      navigate("/admin/authors");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create author");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AuthorFormValues) => authorApi.updateAuthor(Number(id), data),
    onSuccess: () => {
      toast.success("Author updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      navigate("/admin/authors");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update author");
    },
  });

  const onSubmit = (values: AuthorFormValues) => {
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values as any);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin/authors")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Authors
      </Button>

      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Edit Author" : "Add New Author"}</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="J.K. Rowling" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Author biography..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deathDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Death Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Author"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
