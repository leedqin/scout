"use client";

import StudentSelection from "../components/StudentSelection";

export default function SelectStudentsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-center p-6">
      <StudentSelection showStudents={true} />
    </main>
  );
}
