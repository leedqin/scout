import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Booking, Student } from "../../../../types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../../components/ui/hover-card";
import { Label } from "../../../components/ui/label";

export const PreviousBookingCard: React.FC<{ booking: Booking }> = ({
  booking,
}) => {
  const ratingArray = [1, 2, 3, 4, 5];
  const [student, setStudent] = useState<Student | null>(null);

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

  useEffect(() => {
    if (booking.studentId) {
      fetchStudentInfo(booking.studentId);
    }
  }, [booking.studentId]);

  return (
    <div className="flex p-6 bg-white space-x-8 max-w-4xl mx-auto items-center border rounded-md shadow-sm w-full">
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
        <span className="font-semibold text-lg">{booking?.student.name}</span>
      </div>
      <div className="flex flex-col w-2/4">
        <Label htmlFor="feedback" className="mb-1">
          Feedback
        </Label>
        <div>
          {booking?.feedback?.notes &&
          booking?.feedback?.notes.trim() !== "" ? (
            booking.feedback.notes
          ) : (
            <span className="text-gray-500">No feedback available</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2 ml-auto">
        <div className="flex space-x-1">
          {ratingArray.map((r) => (
            <Star
              key={r}
              fill={r <= (booking.feedback?.score || 0) ? "black" : "none"}
              className="w-6 h-6 text-black"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
