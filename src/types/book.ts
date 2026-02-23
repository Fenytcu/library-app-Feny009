// src/types/book.ts

export interface Author {
  id: number;
  name: string;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  authorId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  category: Category;
  reviews?: any[];
}

// Ini yang mungkin hilang/salah nama:
export interface BookDetailResponse {
  success: boolean;
  message: string;
  data: Book; // Hanya satu objek Book, bukan array
}

export interface BooksResponse {
  success: boolean;
  message: string;
  data: {
    books: Book[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface BookParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  rating?: number;
}