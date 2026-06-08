import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  completedLessons: string[];    // slugs (episode ids like "ch1-ep1")
  completedExercises: string[];  // slugs
  completedChallenges: string[]; // slugs

  markComplete: (type: "lesson" | "exercise" | "challenge", slug: string) => void;
  isComplete: (type: "lesson" | "exercise" | "challenge", slug: string) => boolean;
  getCompletionCount: (type: "lesson" | "exercise" | "challenge") => number;
  resetProgress: () => void;
}

function getKey(type: "lesson" | "exercise" | "challenge"): keyof Pick<ProgressState, "completedLessons" | "completedExercises" | "completedChallenges"> {
  switch (type) {
    case "lesson": return "completedLessons";
    case "exercise": return "completedExercises";
    case "challenge": return "completedChallenges";
  }
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      completedExercises: [],
      completedChallenges: [],

      markComplete: (type, slug) => {
        const key = getKey(type);
        const current = get()[key];
        if (current.includes(slug)) return;
        set({ [key]: [...current, slug] });
      },

      isComplete: (type, slug) => {
        const key = getKey(type);
        return get()[key].includes(slug);
      },

      getCompletionCount: (type) => {
        const key = getKey(type);
        return get()[key].length;
      },

      resetProgress: () => {
        set({
          completedLessons: [],
          completedExercises: [],
          completedChallenges: [],
        });
      },
    }),
    { name: "eduvision-progress" }
  )
);
