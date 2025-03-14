import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Preferences {
  preferredSources: string[];
  preferredCategories: string[];
  preferredAuthors: string[];
  enablePersonalization: boolean;
}

interface PreferencesStore {
  preferences: Preferences;
  setPreferredSources: (sources: string[]) => void;
  setPreferredCategories: (categories: string[]) => void;
  setPreferredAuthors: (authors: string[]) => void;
  togglePersonalization: (enabled: boolean) => void;
  resetPreferences: () => void;
}

const initialPreferences: Preferences = {
  preferredSources: [],
  preferredCategories: [],
  preferredAuthors: [],
  enablePersonalization: false,
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: initialPreferences,
      setPreferredSources: (sources) =>
        set((state) => ({
          preferences: { ...state.preferences, preferredSources: sources },
        })),
      setPreferredCategories: (categories) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            preferredCategories: categories,
          },
        })),
      setPreferredAuthors: (authors) =>
        set((state) => ({
          preferences: { ...state.preferences, preferredAuthors: authors },
        })),
      togglePersonalization: (enabled) =>
        set((state) => ({
          preferences: { ...state.preferences, enablePersonalization: enabled },
        })),
      resetPreferences: () => set({ preferences: initialPreferences }),
    }),
    {
      name: "news-preferences",
    }
  )
);
