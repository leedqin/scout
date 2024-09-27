import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Coach } from "../../../types";

interface CoachState {
  coaches: Coach[];
  selectedCoach: Coach | null;
  setCoaches: (coaches: Coach[]) => void;
  setSelectedCoachById: (id: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useCoachStore = create(
  persist<CoachState>(
    (set, get) => ({
      coaches: [],
      selectedCoach: null,
      isLoading: false,

      setCoaches: (coaches) => {
        console.log("Setting coaches in Zustand store:", coaches);
        set({ coaches });
      },

      setSelectedCoachById: (id) => {
        const { coaches } = get();
        console.log("Current coaches in store:", coaches); // Debug log
        const coach = coaches.find((c) => c.id === id) || null;
        if (coach) {
          console.log("Setting selected coach by ID:", coach);
          set({ selectedCoach: coach });
        } else {
          console.warn(`Coach with ID ${id} not found.`);
        }
      },

      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "coach-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
