// Review item as returned by the API (uses `star`, not `rating`)
export interface Review {
  id: number;
  star: number;        // 1–5 (API field name is `star`, not `rating`)
  comment: string;
  userId: number;
  bookId: number;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    profilePhoto?: string;
  };
}

export interface BookStats {
  rating: number;
  reviewCount: number;
}

// POST /api/reviews — create or update a review
export interface CreateReviewData {
  bookId: number;
  star: number;        // Primary field name
  comment: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data: {
    review: Review;
    bookStats: BookStats;
  };
}

// GET /api/reviews/book/{bookId}
export interface BookReviewsResponse {
  success: boolean;
  message: string;
  data: {
    bookId: number;
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// DELETE /api/reviews/{id}
export interface DeleteReviewResponse {
  success: boolean;
  message: string;
  data: {
    bookStats: BookStats;
  };
}
