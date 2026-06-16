import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  // This could be fetched from a /me/ endpoint. For now, we manually manage it in state.
  isVendor: boolean; 
  login: (token: string, isVendor: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      isVendor: false,
      login: (token: string, isVendor: boolean) => set({ isAuthenticated: true, accessToken: token, isVendor }),
      logout: () => set({ isAuthenticated: false, accessToken: null, isVendor: false }),
    }),
    {
      name: 'locyfy-auth-storage', // saves to localStorage
    }
  )
);
