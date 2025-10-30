import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    nombre: string;
    rol: string;
  } | null;
  _hasHydrated: boolean; // ← NUEVO: Flag de hidratación
  setHasHydrated: (state: boolean) => void; // ← NUEVO
  login: (userData: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      _hasHydrated: false, // ← NUEVO
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      login: (userData: any) => {
        set({
          isAuthenticated: true,
          user: {
            id: userData.id,
            nombre: userData.nombre,
            rol: userData.rol,
          },
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: "rudda-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);