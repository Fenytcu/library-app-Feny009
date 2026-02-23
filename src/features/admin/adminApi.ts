import { api } from '@/lib/api';
import type { AdminOverviewResponse } from '@/types/admin';

export const adminApi = {
  // GET /api/admin/overview
  getOverview: async (): Promise<AdminOverviewResponse> => {
    const response = await api.get<AdminOverviewResponse>('/admin/overview');
    return response.data;
  },
};
