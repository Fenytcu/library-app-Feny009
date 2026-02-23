import { api } from '@/lib/api';
import type { 
  Author, 
  AuthorParams, 
  AuthorsResponse, 
  AuthorDetailResponse, 
  AuthorBooksResponse,
  CreateAuthorData  
} from '@/types/author';
import type { BookParams } from '@/types/book';

export const authorApi = {
  // GET /api/authors
  getAuthors: async (params?: AuthorParams) => {
    const response = await api.get<AuthorsResponse>('/authors', { params });
    return response.data;
  },

  // GET /api/authors/popular
  getPopularAuthors: async () => {
    const response = await api.get<AuthorsResponse>('/authors/popular');
    return response.data;
  },

  // GET /api/authors/{id}
  getAuthor: async (id: number) => {
    const response = await api.get<AuthorDetailResponse>(`/authors/${id}`);
    return response.data;
  },

  // GET /api/authors/{id}/books
  getAuthorBooks: async (id: number, params?: BookParams) => {
    const response = await api.get<AuthorBooksResponse>(`/authors/${id}/books`, { params });
    return response.data;
  },

  // POST /api/authors (Admin)
  createAuthor: async (data: CreateAuthorData) => {
    const response = await api.post<{ success: boolean; message: string; data: Author }>('/authors', data);
    return response.data;
  },

  // PUT /api/authors/{id} (Admin)
  updateAuthor: async (id: number, data: Partial<CreateAuthorData>) => {
    const response = await api.put<{ success: boolean; message: string; data: Author }>(`/authors/${id}`, data);
    return response.data;
  },

  // DELETE /api/authors/{id} (Admin)
  deleteAuthor: async (id: number) => {
    const response = await api.delete<{ success: boolean; message: string; data: { id: number } }>(`/authors/${id}`);
    return response.data;
  }
};
