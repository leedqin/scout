// components/CoachSelection.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "../shadcn/Button";
import { useCoachStore } from "../store/useCoachStore";

interface CoachSelectionProps {
  showCoaches: boolean;
}

const CoachSelection: React.FC<CoachSelectionProps> = ({ showCoaches }) => {
  const setCoaches = useCoachStore((state) => state.setCoaches);
  const coaches = useCoachStore((state) => state.coaches);
  const isLoading = useCoachStore((state) => state.isLoading);
  const setIsLoading = useCoachStore((state) => state.setIsLoading);
  const router = useRouter();

  useEffect(() => {
    if (showCoaches && coaches.length === 0) {
      console.log("Fetching coaches...");
      setIsLoading(true);

      fetch("/api/coaches")
        .then((res) => res.json())
        .then((data) => {
          setCoaches(data);
          console.log("Fetched data from API:", data);
        })
        .catch((error) => {
          console.error("Error fetching coaches:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [showCoaches, coaches.length, setCoaches, setIsLoading]);

  if (!showCoaches) {
    return null;
  }

  if (!isLoading) {
    console.log("coaches", coaches);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold mb-4 text-gray-900">
        Select a Coach
      </h2>
      {isLoading ? (
        <div>Loading coaches...</div>
      ) : (
        coaches.map((coach) => (
          <Button
            key={coach.id}
            variant="default"
            className="w-full max-w-sm mx-auto rounded-lg bg-black text-white py-2 px-4 hover:bg-gray-800 border border-gray-300 transition-all duration-150"
            onClick={() => {
              router.push(`/coach/${coach.id}`);
            }}
          >
            {coach.name}
          </Button>
        ))
      )}
    </div>
  );
};

export default CoachSelection;
