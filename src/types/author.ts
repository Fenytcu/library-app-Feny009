export interface Author {
  id: number;
  name: string;
  photo: string;
  bio: string;
  birthDate?: string;
  deathDate?: string;
  rating?: number;
  bookCount?: number;
  accumulatedScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AuthorsResponse {
  success: boolean;
  message: string;
  data: {
    authors: Author[];
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

import type { Book } from './book';
export interface AuthorDetailResponse {
  success: boolean;
  message: string;
  data: Author;
}

export interface AuthorBooksResponse {
  success: boolean;
  message: string;
  data: {
    author: Author;
    bookCount: number;
    books: Book[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateAuthorData {
  name: string;
  photo: string;
  bio: string;
  birthDate?: string;
  deathDate?: string;
}
