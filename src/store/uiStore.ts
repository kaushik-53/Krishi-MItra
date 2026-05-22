import { create } from 'zustand';

interface UIStore {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isPageLoading: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'hi';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setPageLoading: (loading: boolean) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

const initialTheme = (localStorage.getItem('krishi-theme') as 'light' | 'dark') || 'light';
if (typeof window !== 'undefined') {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(initialTheme);
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  isPageLoading: false,
  theme: initialTheme,
  language: (localStorage.getItem('krishi-lang') as 'en' | 'hi') || 'en',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setPageLoading: (isPageLoading) => set({ isPageLoading }),
  setLanguage: (language) => {
    localStorage.setItem('krishi-lang', language);
    set({ language });
  },
  setTheme: (theme) => {
    localStorage.setItem('krishi-theme', theme);
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
    }
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('krishi-theme', nextTheme);
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(nextTheme);
      }
      return { theme: nextTheme };
    });
  },
}));
