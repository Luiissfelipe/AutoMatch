import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      userId: null,
      token: null,
      name: null,
      roles: [],
      interestTags: [],
      needsOnboarding: false,

      actions: {
        setAuth: (userId, token, name, roles = [], interestTags = [], needsOnboarding = false) => 
          set({ userId, token, name, roles, interestTags, needsOnboarding }),

        setTags: (tags) => 
          set({ interestTags: tags, needsOnboarding: false }),

        setProfile: (name, roles) =>
          set((state) => ({ name, roles: roles || state.roles })),

        setToken: (token) =>
          set({ token }),

        clearUser: () => 
          set({ userId: null, token: null, name: null, roles: [], interestTags: [], needsOnboarding: false }),
      }
    }),
    {
      name: '@AutoMatch:auth', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token
      }),
    }
  )
);

export const useAuthActions = () => useAuthStore((state) => state.actions);

export default useAuthStore;
