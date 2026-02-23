import {api} from '@/lib/api';
import type { User } from '@/types/user';

// 1. Request Interface (Apa yang dikirim ke Swagger)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// 2. Response Interface (Apa yang diterima dari Swagger)
// Berdasarkan gambar, data user & token ada di dalam field 'data'
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// 3. API Endpoints
export const authApi = {
  // Login menggunakan endpoint /api/auth/login
  login: async (credentials: LoginRequest) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data; 
  },

  // Register menggunakan endpoint /api/auth/register
  register: async (details: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register', details);
    return response.data;
  },

  // Get Profile (Jika ada endpoint /api/auth/me atau sejenisnya)
  getProfile: async () => {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data;
  },
};