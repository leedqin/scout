import { Send, Star } from "lucide-react";
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
import { Textarea } from "../../../components/ui/textarea";

interface PendingBookingReviewCardProps {
  booking: Booking;
  onFeedbackSubmitted: (bookingId: number) => void;
}

export const PendingBookingReviewCard: React.FC<
  PendingBookingReviewCardProps
> = ({ booking, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
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

  const handleSubmit = async () => {
    if (!feedback || rating === 0) {
      alert("Please provide a rating and feedback before submitting.");
      return;
    }
    try {
      const response = await fetch("/api/coach/submitFeedback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          score: rating,
          notes: feedback,
        }),
      });

      if (response.ok) {
        alert("Feedback submitted successfully!");
        onFeedbackSubmitted(booking.id);
        setFeedback("");
        setRating(0);
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback.");
    }
  };

  return (
    <div className="flex p-4 bg-white items-center border rounded-md shadow-sm w-full">
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
      <div className="flex flex-col w-2/4 mx-4">
        <Label htmlFor="feedback" className="mb-1">
          Feedback
        </Label>
        <Textarea
          id="feedback"
          placeholder="Enter feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 resize-none w-full"
        />
      </div>
      <div className="flex flex-col items-center space-y-2 ml-auto">
        <div className="flex space-x-1">
          {ratingArray.map((r) => (
            <button
              key={r}
              onClick={() => setRating(r)}
              className="focus:outline-none"
            >
              <Star
                fill={r <= rating ? "black" : "none"}
                className="w-6 h-6 text-black"
              />
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center justify-center p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
