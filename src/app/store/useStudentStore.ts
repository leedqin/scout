import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Student } from "../../../types";

interface StudentState {
  students: Student[];
  setStudents: (students: Student[]) => void;
  selectedStudent: Student | undefined;
  setSelectedStudentById: (id: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  refreshBookings: boolean;
  setRefreshBookings: (refresh: boolean) => void;
}

export const useStudentStore = create(
  persist<StudentState>(
    (set, get) => ({
      students: [],
      selectedStudent: undefined,
      isLoading: false,
      setStudents: (students) => {
        console.log("Setting students in Zustand store:", students);
        set({ students });
      },
      setSelectedStudentById: (id) => {
        const { students } = get();
        const student = students.find((s) => s.id === id) || undefined;
        if (student) {
          console.log("Setting selected coach by ID:", student);
          set({ selectedStudent: student });
        } else {
          console.warn(`Student with ID ${id} not found.`);
        }
      },
      setIsLoading: (loading) => set({ isLoading: loading }),
      refreshBookings: false,
      setRefreshBookings: (refresh) => set({ refreshBookings: refresh }),
    }),
    {
      name: "student-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
