import { format, parseISO } from "date-fns";

import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";
import { Slot } from "../../../../types";
import { Button } from "../../../components/ui/button";
import { Calendar } from "../../../components/ui/calendar";
import { Checkbox } from "../../../components/ui/checkbox";
import { useStudentStore } from "../../store/useStudentStore";

interface StudentBookingsCardProps {
  onBookingComplete: () => void;
}

const StudentBookingsCard: React.FC<StudentBookingsCardProps> = ({
  onBookingComplete,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const selectedStudent = useStudentStore((state) => state.selectedStudent);

  const fetchAvailableSlots = async (date: Date) => {
    try {
      const timeZone = "America/New_York";
      const isoDateString = date.toISOString();
      const formattedDate = formatInTimeZone(
        isoDateString,
        timeZone,
        "yyyy-MM-dd"
      );

      const response = await fetch(
        `/api/students/openSlots?date=${formattedDate}`
      );

      if (response.ok) {
        const slotsData: Slot[] = await response.json();
        const slots = slotsData.map((slot) => {
          const startTimeString =
            typeof slot.startTime === "string"
              ? slot.startTime
              : slot.startTime.toISOString();
          const endTimeString =
            typeof slot.endTime === "string"
              ? slot.endTime
              : slot.endTime.toISOString();

          return {
            ...slot,
            startTime: fromZonedTime(parseISO(startTimeString), timeZone),
            endTime: fromZonedTime(parseISO(endTimeString), timeZone),
          };
        });

        setAvailableSlots(slots);
      } else {
        console.error("Failed to fetch available slots");
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      fetchAvailableSlots(date);
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot((prevSelectedSlot) =>
      prevSelectedSlot?.id === slot.id ? undefined : slot
    );
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedDate || !selectedStudent) return;

    setLoading(true);

    try {
      const response = await fetch("/api/students/createBookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          slotId: selectedSlot.id,
        }),
      });

      if (response.ok) {
        alert(
          `Slot booked successfully from ${format(
            selectedSlot.startTime,
            "hh:mm a"
          )} to ${format(selectedSlot.endTime, "hh:mm a")}`
        );

        setAvailableSlots((prevSlots) =>
          prevSlots.filter((slot) => slot.id !== selectedSlot.id)
        );
        setSelectedSlot(undefined);
        onBookingComplete();
      } else {
        alert("Failed to book slot. It might already be booked.");
      }
    } catch (error) {
      console.error("Error booking slot:", error);
      alert("An error occurred while booking the slot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex p-6 border rounded-lg shadow-md bg-white space-x-8 max-w-4xl mx-auto">
      <div className="w-1/2 border-r pr-4">
        <h2 className="text-lg font-semibold mb-2">Select a Date</h2>
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleDateChange}
          className="rounded-md border"
        />
      </div>
      <div className="w-1/2 pl-4">
        <h2 className="text-lg font-semibold mb-2">
          Available Slots for {selectedDate ? format(selectedDate, "PPP") : ""}
        </h2>
        <ul className="space-y-2">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <li
                key={slot.id}
                className="flex items-center p-2 border-b space-x-2"
              >
                <Checkbox
                  id={`slot-${slot.id}`}
                  checked={selectedSlot?.id === slot.id}
                  onCheckedChange={() => handleSlotSelect(slot)}
                />
                <label htmlFor={`slot-${slot.id}`} className="cursor-pointer">
                  {format(slot.startTime, "hh:mm a")} -{" "}
                  {format(slot.endTime, "hh:mm a")}
                </label>
              </li>
            ))
          ) : (
            <li>No slots available for this date.</li>
          )}
        </ul>

        {availableSlots.length > 0 && (
          <div className="mt-4">
            <Button
              variant="default"
              className="w-full text-white rounded-md py-2 hover:bg-zinc-600 transition-all"
              onClick={handleSubmit}
              disabled={!selectedSlot || loading}
            >
              {loading ? "Booking Slot..." : "Book Slot"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentBookingsCard;
