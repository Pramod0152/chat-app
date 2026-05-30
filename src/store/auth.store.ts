import { create } from 'zustand';

import { removeToken, setToken } from '@/lib/token';
import type { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  setBootstrapping: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isBootstrapping: true,

  setAuth: (user, token) => {
    setToken(token);
    set({ user, isAuthenticated: true });
  },
  clearAuth: () => {
    removeToken();
    set({ user: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
  setBootstrapping: (value) => set({ isBootstrapping: value }),
}));
