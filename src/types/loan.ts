import type { Book } from "./book";
import type { User } from "./user";

export type LoanStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE';

export interface LoanBorrower {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface Loan {
  id: number;
  userId?: number;
  bookId?: number;
  status: LoanStatus;
  displayStatus?: string; // e.g. "Active", "Overdue", "Returned"
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  durationDays?: number;
  book?: Book;
  user?: User;         // used by user-facing endpoints
  borrower?: LoanBorrower; // used by admin endpoints
}

// POST /api/loans - Borrow a book
export interface BorrowBookData {
  bookId: number;
  duration?: number; // days
}

export interface BorrowBookResponse {
  success: boolean;
  message: string;
  data: {
    loan: Loan;
  };
}

// PATCH /api/loans/{id}/return - Return a book
export interface ReturnBookResponse {
  success: boolean;
  message: string;
  data: {
    loan: Loan;
  };
}

// POST /api/loans/from-cart - Borrow from cart
export interface BorrowFromCartResponse {
  success: boolean;
  message: string;
  data: {
    loans: Loan[];
    failed: { bookId: number; reason: string }[];
    removedFromCart: number;
    message: string;
  };
}

// GET /api/loans/my - Get user's own loans
export interface MyLoansResponse {
  success: boolean;
  message: string;
  data: {
    loans: Loan[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Admin types
export interface LoanListResponse {
  success: boolean;
  message: string;
  data: {
    loans: Loan[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// POST /api/admin/loans - Admin creates a loan manually
export interface AdminCreateLoanData {
  userId: number;
  bookId: number;
  dueAt?: string; // ISO date string
}

export interface AdminCreateLoanResponse {
  success: boolean;
  message: string;
  data: {
    loan: Loan;
  };
}

// PATCH /api/admin/loans/{id} - Admin updates a loan
export interface AdminUpdateLoanData {
  status?: LoanStatus;
  dueAt?: string;       // ISO date string
  returnedAt?: string;  // ISO date string
}

export interface AdminUpdateLoanResponse {
  success: boolean;
  message: string;
  data: {
    loan: Loan;
  };
}

// GET /api/admin/loans/overdue
export interface OverdueLoan {
  id: number;
  userId: number;
  bookId: number;
  status: LoanStatus;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  book: {
    id: number;
    title: string;
    author: {
      id: number;
      name: string;
    };
  };
}

export interface OverdueLoanResponse {
  success: boolean;
  message: string;
  data: {
    overdue: OverdueLoan[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
