import { api } from '@/lib/api';
import type { 
  Category, 
  CategoryParams, 
  CategoriesResponse, 
  CreateCategoryData 
} from '@/types/category';

export const categoryApi = {
  // GET /api/categories
  getCategories: async (params?: CategoryParams) => {
    const response = await api.get<CategoriesResponse>('/categories', { params });
    return response.data;
  },

  // POST /api/categories (Admin)
  createCategory: async (data: CreateCategoryData) => {
    const response = await api.post<{ success: boolean; message: string; data: Category }>('/categories', data);
    return response.data;
  },

  // PUT /api/categories/{id} (Admin)
  updateCategory: async (id: number, data: Partial<CreateCategoryData>) => {
    const response = await api.put<{ success: boolean; message: string; data: Category }>(`/categories/${id}`, data);
    return response.data;
  },

  // DELETE /api/categories/{id} (Admin)
  deleteCategory: async (id: number) => {
    const response = await api.delete<{ success: boolean; message: string; data: { id: number } }>(`/categories/${id}`);
    return response.data;
  }
};
