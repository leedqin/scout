"use client";

import React, { useEffect } from "react";

import { useCoachStore } from "../../store/useCoachStore";
import NavBar from "../NavBar/NavBar";
import OpenSlotsCard from "./OpenSlots";
import ReviewBookingsCard from "./ReviewBookings";
import UpcomingBookings from "./UpcomingBookings";

interface CoachContainerProps {
  coachId: number;
}

const CoachContainer: React.FC<CoachContainerProps> = ({ coachId }) => {
  const setSelectedCoachById = useCoachStore(
    (state) => state.setSelectedCoachById
  );
  const selectedCoach = useCoachStore((state) => state.selectedCoach);
  const isLoading = useCoachStore((state) => state.isLoading);
  const coaches = useCoachStore((state) => state.coaches);

  useEffect(() => {
    if (coachId && coaches.length > 0) {
      setSelectedCoachById(coachId);
    }
  }, [coachId, setSelectedCoachById, coaches.length]);

  if (isLoading || coaches.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <NavBar navBarView="COACH" />
      <div className="p-8">
        <h1 className="text-xl font-bold">
          Welcome Coach {selectedCoach?.name}!
        </h1>
        <div className="items-center gap-4 space-y-4">
          <OpenSlotsCard />
          <ReviewBookingsCard />
          <UpcomingBookings />
        </div>
      </div>
    </div>
  );
};

export default CoachContainer;
