import { User } from '@/db/schema/user';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface IAuthStore {
  hydrated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      hydrated: false,
      user: null,

      setUser: (user: User | null) =>
        set({ user: user ? { ...user } : null }),

      clearUser: () =>
        set({ user: null }),

      setHydrated: (hydrated: boolean) =>
        set({ hydrated }),
    }),
    {
      name: 'authStore',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
      storage: createJSONStorage(() => sessionStorage)
    },
  )
)