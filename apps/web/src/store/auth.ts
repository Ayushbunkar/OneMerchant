import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (id: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (id, password) => {
        // Simulated authentication logic
        if (id && password) {
          set({
            user: { id, name: id },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // unique name
    }
  )
);
