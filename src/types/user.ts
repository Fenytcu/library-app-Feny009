export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  phone?: string | null;
  profilePhoto?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  profilePhoto?: string;
  password?: string;
}

// GET /api/me
export interface LoanStats {
  borrowed: number;
  late: number;
  returned: number;
  total: number;
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    profile: User;
    loanStats: LoanStats;
    reviewsCount: number;
  };
}

// PATCH /api/me
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: User;
  };
}

// GET /api/me/loans
export interface MyLoan {
  id: number;
  userId: number;
  bookId: number;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  durationDays?: number;
  book: {
    id: number;
    title: string;
    coverImage: string;
    author?: { id: number; name: string };
    category?: { id: number; name: string };
  };
}


export interface MyLoansResponse {
  success: boolean;
  message: string;
  data: {
    loans: MyLoan[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// GET /api/me/reviews
export interface MyReview {
  id: number;
  star: number;
  comment: string;
  bookId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  book?: {
    id: number;
    title: string;
    coverImage?: string;
    author?: { id: number; name: string };
    category?: { id: number; name: string };
  };
}

export interface MyReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: MyReview[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
