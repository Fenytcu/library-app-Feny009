import { api } from '@/lib/api';
import type { 
  BooksResponse, 
  BookDetailResponse, 
  BookParams,
  Book 
} from '@/types/book';

export interface CreateBookData {
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage: string;
  totalCopies: number;
  authorId: number;
  categoryId: number;
}

export const bookApi = {
  // GET /api/books - Mendukung pencarian, kategori, dan pagination
  getBooks: async (params?: BookParams) => {
    const response = await api.get<BooksResponse>('/books', { 
      params: {
        search: params?.search || undefined,
        category: params?.category || undefined,
        page: params?.page || 1,
        limit: params?.limit || 12,
        rating: params?.rating || undefined,
      }
    });
    return response.data;
  },

  // GET /api/books/{id} - Detail satu buku
  getBook: async (id: number) => {
    const response = await api.get<BookDetailResponse>(`/books/${id}`);
    return response.data;
  },

  // GET /api/books/recommend - Rekomendasi buku
  getRecommendations: async (params?: { page?: number; limit?: number; mode?: string }) => {
    const response = await api.get<{ 
      success: boolean; 
      message: string; 
      data: { 
        mode: string; 
        books: Book[]; 
        pagination: { 
          page: number; 
          limit: number; 
          total: number; 
          totalPages: number; 
        } 
      } 
    }>('/books/recommend', { 
      params: { 
        page: params?.page || 1,
        limit: params?.limit || 8,
        mode: params?.mode || 'rating' 
      } 
    });
    return response.data;
  },

  // GET /api/admin/books
  getAdminBooks: async (params?: BookParams) => {
    const response = await api.get<BooksResponse>('/admin/books', { 
      params: {
        search: params?.search || undefined,
        category: params?.category || undefined,
        page: params?.page || 1,
        limit: params?.limit || 12,
        rating: params?.rating || undefined,
      }
    });
    return response.data;
  },

  // POST /api/books - Create new book
  createBook: async (data: CreateBookData) => {
    const response = await api.post<{ success: boolean; message: string; data: Book }>(
      '/books',
      data
    );
    return response.data;
  },

  // PUT /api/books/{id} - Update book
  updateBook: async ({ id, data }: { id: number; data: CreateBookData }) => {
    const response = await api.put<{ success: boolean; message: string; data: { book: Book } }>(
      `/books/${id}`,
      data
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data.book
    };
  },

  // DELETE /api/books/{id}
  deleteBook: async (id: number) => {
    const response = await api.delete<{ success: boolean; message: string; data: { id: number } }>(
      `/books/${id}`
    );
    return response.data;
  }
};