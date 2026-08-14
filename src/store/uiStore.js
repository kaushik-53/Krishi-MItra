import { create } from 'zustand';
const initialTheme = localStorage.getItem('krishi-theme') || 'light';
if (typeof window !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(initialTheme);
}
export const useUIStore = create((set) => ({
    isSidebarOpen: true,
    isMobileMenuOpen: false,
    isPageLoading: false,
    theme: initialTheme,
    language: localStorage.getItem('krishi-lang') || 'en',
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
