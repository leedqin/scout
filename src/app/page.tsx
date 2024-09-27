"use client";

import { useRouter } from "next/navigation";
import { Button } from "./shadcn/Button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-center p-6">
      <h1 className="text-6xl font-extrabold mb-4 tracking-tight text-gray-900">
        Welcome to Scout
      </h1>
      <p className="text-gray-600 mb-6 text-lg">
        Get started by choosing your role below.
      </p>
      <div className="flex space-x-4">
        <Button
          variant="default"
          key="coach"
          className="inline-flex items-center justify-center rounded-lg bg-black text-white py-2 px-4 hover:bg-gray-800 transition-all duration-150"
          onClick={() => {
            router.push("/selectCoaches");
          }}
        >
          Coaches
        </Button>

        <Button
          variant="default"
          key="student"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 text-black py-2 px-4 hover:bg-gray-200 transition-all duration-150"
          onClick={() => {
            router.push("/selectStudents");
          }}
        >
          Students
        </Button>
      </div>
    </main>
  );
}
