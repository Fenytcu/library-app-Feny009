import type { Book } from './book';

// GET /api/cart
export interface CartItem {
  id: number;
  bookId: number;
  addedAt: string;
  book: Book;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: {
    cartId: number;
    items: CartItem[];
    itemCount: number;
  };
}

// POST /api/cart/items — add a book to cart
export interface AddToCartData {
  bookId: number;
}

export interface AddToCartItem {
  id: number;
  cartId: number;
  bookId: number;
  createdAt: string;
  book: Book;
}

export interface AddToCartResponse {
  success: boolean;
  message: string;
  data: {
    item: AddToCartItem;
  };
}

// DELETE /api/cart — clear the entire cart
export interface ClearCartResponse {
  success: boolean;
  message: string;
  data: {
    cartId: number;
  };
}

// GET /api/cart/checkout — checkout payload (user info + items)
export interface CheckoutUser {
  name: string;
  email: string;
  nomorHandphone: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    user: CheckoutUser;
    items: CartItem[];
    itemCount: number;
  };
}
