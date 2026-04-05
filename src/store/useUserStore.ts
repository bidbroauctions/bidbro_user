// store/useUserStore.ts
import { Category, Company, User } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Define the UserState interface
export interface UserState {
  user: User | null;
  company: Company | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User, accessToken?: string, refreshToken?: string) => void;
  setCompany: (company: Company) => void;
  categories: Category[] | [];
  setCategories: (categories: Category[]) => void;
  clearUser: () => void;
}

// Create Zustand store with persistence
export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (
        user: Partial<User>,
        accessToken?: string,
        refreshToken?: string
      ) => {
        const d = {
          user,
        } as UserState;
        if (accessToken) {
          d.accessToken = accessToken;
        }
        if (refreshToken) {
          d.refreshToken = refreshToken;
        }
        set(d);
      },
      setCompany: (company: Company) => set({ company }),
      categories: [],
      setCategories: (categories: Category[]) => set({ categories }),
      clearUser: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          company: null,
        }),
    }),
    {
      name: "user-storage", // Name of item in storage (localStorage key)
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
) as unknown as () => UserState;
