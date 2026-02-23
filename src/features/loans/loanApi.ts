import { api } from '@/lib/api';
import type {
  LoanListResponse,
  BorrowBookData,
  BorrowBookResponse,
  ReturnBookResponse,
  BorrowFromCartResponse,
  MyLoansResponse,
  AdminCreateLoanData,
  AdminCreateLoanResponse,
  AdminUpdateLoanData,
  AdminUpdateLoanResponse,
  OverdueLoanResponse,
} from '@/types/loan';

export const loanApi = {
  // ─── User Endpoints ───────────────────────────────────────────────

  // POST /api/loans - Borrow a book
  borrowBook: async (data: BorrowBookData): Promise<BorrowBookResponse> => {
    const response = await api.post<BorrowBookResponse>('/loans', data);
    return response.data;
  },

  // PATCH /api/loans/{id}/return - Return a borrowed book
  returnBook: async (id: number): Promise<ReturnBookResponse> => {
    const response = await api.patch<ReturnBookResponse>(`/loans/${id}/return`);
    return response.data;
  },

  // POST /api/loans/from-cart - Borrow all items from cart
  borrowFromCart: async (data: { itemIds: number[]; borrowDuration: number }): Promise<BorrowFromCartResponse> => {
    const response = await api.post<BorrowFromCartResponse>('/loans/from-cart', {
      itemIds: data.itemIds,
      borrowDuration: data.borrowDuration,
    });
    return response.data;
  },

  // GET /api/loans/my - Get current user's loan history
  getMyLoans: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<MyLoansResponse> => {
    const response = await api.get<MyLoansResponse>('/loans/my', { params });
    return response.data;
  },

  // ─── Admin Endpoints ──────────────────────────────────────────────

  // GET /api/admin/loans
  getLoans: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<LoanListResponse> => {
    const response = await api.get<LoanListResponse>('/admin/loans', { params });
    return response.data;
  },

  // PATCH /api/admin/loans/{id}
  updateLoan: async (id: number, data: AdminUpdateLoanData): Promise<AdminUpdateLoanResponse> => {
    const response = await api.patch<AdminUpdateLoanResponse>(
      `/admin/loans/${id}`,
      data
    );
    return response.data;
  },

  // POST /api/admin/loans - Create a loan manually
  createLoan: async (data: AdminCreateLoanData): Promise<AdminCreateLoanResponse> => {
    const response = await api.post<AdminCreateLoanResponse>(
      '/admin/loans',
      data
    );
    return response.data;
  },

  // GET /api/admin/loans/overdue
  getOverdueLoans: async (params?: { page?: number; limit?: number }): Promise<OverdueLoanResponse> => {
    const response = await api.get<OverdueLoanResponse>('/admin/loans/overdue', { params });
    return response.data;
  },
};
