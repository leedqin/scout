import { useEffect, useState } from "react";
import { Booking } from "../../../../types";
import { useCoachStore } from "../../store/useCoachStore";
import { PendingBookingReviewCard } from "./PendingBookingReviewCard";
import { PreviousBookingCard } from "./PreviousBookingCard";

const ReviewBookingsCard: React.FC = () => {
  const selectedCoach = useCoachStore((state) => state.selectedCoach);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [previousBookings, setPreviousBookings] = useState<Booking[]>([]);
  const fetchBookings = async () => {
    if (selectedCoach) {
      try {
        const response = await fetch(
          `/api/coach/bookings?coachId=${selectedCoach.id}`
        );

        if (response.ok) {
          const bookingsData = await response.json();
          const formattedBookings = bookingsData.map((booking: Booking) => ({
            ...booking,
            slot: {
              ...booking.slot,
              startTime: new Date(booking.slot.startTime),
              endTime: new Date(booking.slot.endTime),
            },
          }));

          const pending = formattedBookings.filter(
            (booking: Booking) => booking.needsReview
          );
          const previous = formattedBookings.filter(
            (booking: Booking) => !booking.needsReview
          );

          console.log(previous);
          setPendingBookings(pending);
          setPreviousBookings(previous);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }
  };
  useEffect(() => {
    fetchBookings();
  }, [selectedCoach]);

  const handleFeedbackSubmission = async () => {
    await fetchBookings();
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white max-w-4xl mx-auto mt-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Bookings Pending Review</h2>
        <div className="space-y-4">
          {pendingBookings.length > 0 ? (
            pendingBookings.map((booking) => (
              <PendingBookingReviewCard
                key={booking.id}
                booking={booking}
                onFeedbackSubmitted={handleFeedbackSubmission}
              />
            ))
          ) : (
            <p className="text-gray-500">No bookings pending review.</p>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Previous Bookings</h2>
        {previousBookings.length > 0 ? (
          <div className="space-y-4">
            {previousBookings.map((booking) => (
              <PreviousBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No previous bookings available.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewBookingsCard;
