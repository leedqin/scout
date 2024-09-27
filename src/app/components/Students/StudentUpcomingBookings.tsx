import { useEffect, useState } from "react";
import { Booking } from "../../../../types";
import { useStudentStore } from "../../store/useStudentStore";
import UpcomingBookingCard from "./UpcomingBookingCard";
interface StudentUpcomingBookingsProps {
  refreshTrigger: boolean;
}

const StudentUpcomingBookings: React.FC<StudentUpcomingBookingsProps> = ({
  refreshTrigger,
}) => {
  const selectedStudent = useStudentStore((state) => state.selectedStudent);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchUpcomingBookings = async () => {
      if (selectedStudent) {
        try {
          const response = await fetch(
            `/api/students/getBookings?studentId=${selectedStudent.id}`
          );

          if (response.ok) {
            const bookingsData: Booking[] = await response.json();

            const formattedBookings = bookingsData.map((booking) => ({
              ...booking,
              slot: {
                ...booking.slot,
                startTime: new Date(booking.slot.startTime),
                endTime: new Date(booking.slot.endTime),
              },
            }));

            setUpcomingBookings(formattedBookings);
          } else {
            console.error("Failed to fetch upcoming bookings");
          }
        } catch (error) {
          console.error("Error fetching upcoming bookings:", error);
        }
      }
    };

    fetchUpcomingBookings();
  }, [selectedStudent, refreshTrigger]);

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white max-w-4xl mx-auto mt-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
        <div className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <UpcomingBookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <p className="text-gray-500">No upcoming bookings.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentUpcomingBookings;
