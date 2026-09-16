import { User } from '@/db/schema/user';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type StoreUser = Partial<User> & {
  id: string;
  name: string;
  username?: string;
  email?: string | null;
  emailVerified?: boolean;
  image?: string | null;
  isAnonymous?: boolean | null;
};

interface IAuthStore {
  hydrated: boolean;
  user: StoreUser | null;
  setUser: (user: StoreUser | null) => void;
  clearUser: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      hydrated: false,
      user: null,

      setUser: (user: StoreUser | null) =>
        set({ user: user ? { ...user } : null }),

      clearUser: () =>
        set({ user: null }),

      setHydrated: (hydrated: boolean) =>
        set({ hydrated }),
    }),
    {
      name: 'authStore',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);