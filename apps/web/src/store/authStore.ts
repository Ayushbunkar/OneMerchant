import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tenant: Tenant, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      isAuthenticated: false,
      setAuth: (user, tenant, token) => {
        localStorage.setItem("accessToken", token);
        set({ user, tenant, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem("accessToken");
        set({ user: null, tenant: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
