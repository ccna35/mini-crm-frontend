import { create } from 'zustand';
import type { Theme, User } from '../types';

interface ThemeStore {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
}

interface UIStore {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

// Theme Store
export const useThemeStore = create<ThemeStore>((set) => {
    // Get initial theme from localStorage or system preference
    const getInitialTheme = (): Theme => {
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored) return stored;

        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    };

    const initialTheme = getInitialTheme();

    return {
        theme: initialTheme,
        toggleTheme: () =>
            set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', newTheme);
                if (typeof document !== 'undefined') {
                    document.documentElement.classList.toggle('dark');
                }
                return { theme: newTheme };
            }),
        setTheme: (theme) => {
            localStorage.setItem('theme', theme);
            if (typeof document !== 'undefined') {
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            set({ theme });
        },
    };
});

// User Store
export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));

// UI Store
export const useUIStore = create<UIStore>((set) => ({
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
}));

// Initialize theme on hydration
if (typeof window !== 'undefined') {
    const initialTheme = (localStorage.getItem('theme') as Theme) || 'light';
    useThemeStore.setState({ theme: initialTheme });

    if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}
