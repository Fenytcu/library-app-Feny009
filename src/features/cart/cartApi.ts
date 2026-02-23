import { api } from '@/lib/api';
import type {
  CartResponse,
  AddToCartData,
  AddToCartResponse,
  ClearCartResponse,
  CheckoutResponse,
} from '@/types/cart';
import type { BorrowFromCartResponse } from '@/types/loan';

export const cartApi = {
  // GET /api/cart — returns cartId, items[], itemCount
  getCart: async (): Promise<CartResponse> => {
    const response = await api.get<CartResponse>('/cart');
    return response.data;
  },

  // POST /api/cart/items — add a book; returns data.item with full book details
  addToCart: async (data: AddToCartData): Promise<AddToCartResponse> => {
    const response = await api.post<AddToCartResponse>('/cart/items', data);
    return response.data;
  },

  // DELETE /api/cart/items/{itemId} — remove a single item
  removeFromCart: async (itemId: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/cart/items/${itemId}`);
    return response.data;
  },

  // DELETE /api/cart — clear entire cart; returns data.cartId
  clearCart: async (): Promise<ClearCartResponse> => {
    const response = await api.delete<ClearCartResponse>('/cart');
    return response.data;
  },

  // GET /api/cart/checkout — checkout payload: user info + items (read-only, does NOT confirm borrow)
  getCheckout: async (): Promise<CheckoutResponse> => {
    const response = await api.get<CheckoutResponse>('/cart/checkout');
    return response.data;
  },

  // POST /api/loans/from-cart — actually confirm borrow from cart
  confirmBorrow: async (data: { itemIds: number[]; borrowDuration: number }): Promise<BorrowFromCartResponse> => {
    const response = await api.post<BorrowFromCartResponse>('/loans/from-cart', {
      itemIds: data.itemIds,
      borrowDuration: data.borrowDuration,
    });
    return response.data;
  },
};
