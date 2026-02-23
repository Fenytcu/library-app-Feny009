export interface Category {
  id: number;
  name: string;
  description?: string;
  bookCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: {
    categories: Category[];
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}
