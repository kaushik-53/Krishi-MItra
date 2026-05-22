import { create } from 'zustand';
import type { UserProfile } from '@/types';

interface AuthStore {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false, error: null }),
}));
