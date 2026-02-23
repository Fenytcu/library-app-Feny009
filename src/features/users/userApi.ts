import { api } from '@/lib/api';
import type {
  UserListResponse,
  UserParams,
  UpdateProfileData,
  MeResponse,
  UpdateProfileResponse,
  MyLoansResponse,
  MyReviewsResponse,
} from '@/types/user';

export const userApi = {
  // GET /api/admin/users
  getUsers: async (params?: UserParams) => {
    const response = await api.get<UserListResponse>('/admin/users', { params });
    return response.data;
  },

  // GET /api/me — profile + loanStats + reviewsCount
  getMe: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>('/me');
    return response.data;
  },

  // PATCH /api/me — update name, phone, profilePhoto
  updateProfile: async (data: UpdateProfileData): Promise<UpdateProfileResponse> => {
    const response = await api.patch<UpdateProfileResponse>('/me', data);
    return response.data;
  },

  // GET /api/me/loans — active & history
  getMyLoans: async (params?: { status?: string; page?: number; limit?: number }): Promise<MyLoansResponse> => {
    const response = await api.get<MyLoansResponse>('/me/loans', { params });
    return response.data;
  },

  // GET /api/me/reviews — reviews given by the current user
  getMyReviews: async (params?: { page?: number; limit?: number }): Promise<MyReviewsResponse> => {
    const response = await api.get<MyReviewsResponse>('/me/reviews', { params });
    return response.data;
  },
};
