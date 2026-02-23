// GET /api/admin/overview

export interface AdminOverviewTopBook {
  id: number;
  title: string;
  borrowCount: number;
  rating: number;
  availableCopies: number;
  totalCopies: number;
  author: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}

export interface AdminOverviewResponse {
  success: boolean;
  message: string;
  data: {
    totals: {
      users: number;
      books: number;
    };
    loans: {
      active: number;
      overdue: number;
    };
    topBorrowed: AdminOverviewTopBook[];
    generatedAt: string;
  };
}
