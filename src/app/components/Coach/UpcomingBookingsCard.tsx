import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Booking, Student } from "../../../../types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../../components/ui/hover-card";

const UpcomingBookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const fetchStudentInfo = async (studentId: number) => {
    try {
      const response = await fetch(`/api/students/${studentId}`);
      if (response.ok) {
        const data: Student = await response.json();
        setStudent(data);
      } else {
        console.error("Failed to fetch student information");
      }
    } catch (error) {
      console.error("Error fetching student information:", error);
    }
  };

  const cancelBooking = async () => {
    try {
      setIsCancelling(true);
      const response = await fetch(`/api/students/cancelBooking`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      if (response.ok) {
        alert("Booking canceled successfully!");
        setIsVisible(false);
      } else {
        alert("Failed to cancel booking. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("An error occurred while canceling the booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    if (booking.studentId) {
      fetchStudentInfo(booking.studentId);
    }
  }, [booking.studentId]);

  if (!isVisible) return null;

  return (
    <div className="flex p-4 bg-white items-center border rounded-md shadow-sm w-full hover:bg-gray-50 relative group">
      <div className="flex items-center space-x-4 w-1/4">
        <HoverCard>
          <HoverCardTrigger>
            <Avatar className="h-14 w-14">
              <AvatarImage
                src="https://example.com/user.jpg"
                alt="User Avatar"
              />
              <AvatarFallback>{student?.name?.charAt(0) || "S"}</AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="p-4 bg-white rounded-md shadow-md border max-w-xs">
            <div className="flex flex-col space-y-2">
              <span className="font-semibold text-lg">{student?.name}</span>
              <span className="text-sm text-gray-500">{student?.email}</span>
              <span className="text-sm text-gray-500">
                {student?.phoneNumber}
              </span>
            </div>
          </HoverCardContent>
        </HoverCard>
        <span className="font-semibold text-lg">{student?.name}</span>
      </div>

      <div className="flex flex-col w-2/4 mx-4">
        <span className="text-md font-bold">Booking Date & Timings</span>
        <span>{format(new Date(booking.slot.startTime), "PPP")}</span>
        <span>
          {format(new Date(booking.slot.startTime), "hh:mm a")} -{" "}
          {format(new Date(booking.slot.endTime), "hh:mm a")}
        </span>
      </div>
      <div className="absolute center-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          onClick={cancelBooking}
          disabled={isCancelling}
          className="bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded-md"
        >
          {isCancelling ? "Cancelling..." : "Cancel"}
        </Button>
      </div>
    </div>
  );
};

export default UpcomingBookingCard;
