import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  login: (username: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => set({ refreshToken: token }),
  login: async (username: string, password: string) => {
    const response = await axiosInstance.post('/posts', {
      username,
      password,
    });
    // Mocking the token as the API does not provide it
    set({ 
      accessToken: 'mock-access-token', 
      refreshToken: 'mock-refresh-token' 
    });
  },
}));