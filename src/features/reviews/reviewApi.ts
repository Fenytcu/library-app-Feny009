import { api } from '@/lib/api';
import type {
  BookReviewsResponse,
  CreateReviewData,
  CreateReviewResponse,
  DeleteReviewResponse,
} from '@/types/review';

export const reviewApi = {
  // GET /api/reviews/book/{bookId}
  getBookReviews: async (
    bookId: number,
    params?: { page?: number; limit?: number }
  ): Promise<BookReviewsResponse> => {
    const response = await api.get<BookReviewsResponse>(
      `/reviews/book/${bookId}`,
      { params }
    );
    return response.data;
  },

  // POST /api/reviews — create or update a review for a book
  createReview: async (data: CreateReviewData): Promise<CreateReviewResponse> => {
    const response = await api.post<CreateReviewResponse>('/reviews', data);
    return response.data;
  },

  // DELETE /api/reviews/{id}
  deleteReview: async (id: number): Promise<DeleteReviewResponse> => {
    const response = await api.delete<DeleteReviewResponse>(`/reviews/${id}`);
    return response.data;
  },
};
