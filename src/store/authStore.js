import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
    setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false, error: null }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),
    logout: () => set({ user: null, isAuthenticated: false, isLoading: false, error: null }),
}));
