"use client";

import { addHours, format, setHours, setMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Slot } from "../../../../types";
import { Button } from "../../../components/ui/button";
import { Calendar } from "../../../components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useCoachStore } from "../../store/useCoachStore";

const OpenSlotsCard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | undefined>();
  const [upcomingSlots, setUpcomingSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const selectedCoach = useCoachStore((state) => state.selectedCoach);

  // Slot timings from 8:00 AM to 6:00 PM (last slot ends at 6:00 PM)
  const slotTimings = ["08:00", "10:00", "12:00", "14:00", "16:00"];

  useEffect(() => {
    const fetchUpcomingSlots = async () => {
      if (selectedCoach && selectedDate) {
        try {
          const response = await fetch(
            `/api/coach/openSlots?coachId=${selectedCoach.id}`
          );
          if (response.ok) {
            const slotsData: Slot[] = await response.json();
            const slots = slotsData.map((slot) => ({
              ...slot,
              startTime: new Date(
                formatInTimeZone(
                  slot.startTime,
                  "America/New_York",
                  "yyyy-MM-dd'T'HH:mm:ssXXX"
                )
              ),
              endTime: new Date(
                formatInTimeZone(
                  slot.endTime,
                  "America/New_York",
                  "yyyy-MM-dd'T'HH:mm:ssXXX"
                )
              ),
            }));

            const filteredSlots = slots.filter(
              (slot) =>
                format(slot.startTime, "yyyy-MM-dd") ===
                format(selectedDate, "yyyy-MM-dd")
            );

            setUpcomingSlots(filteredSlots);
          } else {
            console.error("Failed to fetch upcoming slots");
          }
        } catch (error) {
          console.error("Error fetching upcoming slots:", error);
        }
      }
    };
    fetchUpcomingSlots();
  }, [selectedDate, selectedCoach]);

  useEffect(() => {
    handleDateChange(new Date());
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date || new Date());
    if (date) {
      const slots = slotTimings.map((time) => {
        const [hour, minute] = time.split(":");
        const slotStartTime = setMinutes(
          setHours(date, parseInt(hour)),
          parseInt(minute)
        );
        const slotEndTime = addHours(slotStartTime, 2);

        return {
          id: Math.random(),
          startTime: slotStartTime,
          endTime: slotEndTime,
          isBooked: false,
          coachId: selectedCoach?.id || 0,
        } as Slot;
      });

      const availableFilteredSlots = slots.filter(
        (slot) =>
          !upcomingSlots.some(
            (upcomingSlot) =>
              upcomingSlot.startTime.getTime() === slot.startTime.getTime() &&
              upcomingSlot.endTime.getTime() === slot.endTime.getTime()
          )
      );

      setAvailableSlots(availableFilteredSlots);
    }
  };

  const handleSlotSelect = (slotId: string) => {
    const selected = availableSlots.find(
      (slot) => slot.id.toString() === slotId
    );
    setSelectedSlot(selected);
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedDate || !selectedCoach) return;

    setLoading(true);
    try {
      const startTimeNY = formatInTimeZone(
        selectedSlot.startTime,
        "America/New_York",
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      );
      const endTimeNY = formatInTimeZone(
        selectedSlot.endTime,
        "America/New_York",
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      );

      const response = await fetch("/api/coach/createSlots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startTime: startTimeNY,
          endTime: endTimeNY,
          coachId: selectedCoach.id,
        }),
      });

      if (response.ok) {
        alert(
          `Slot created successfully from ${format(
            selectedSlot.startTime,
            "hh:mm a"
          )} for ${selectedDate.toDateString()}`
        );
        setUpcomingSlots([...upcomingSlots, selectedSlot]);
        setAvailableSlots(
          availableSlots.filter((slot) => slot.id !== selectedSlot.id)
        );
      } else {
        alert("Failed to create slot.");
      }
    } catch (error) {
      console.error("Error creating slot:", error);
      alert("An error occurred while creating the slot.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    try {
      const response = await fetch(`/api/coach/deleteSlot`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slotId }),
      });

      if (response.ok) {
        alert("Slot deleted successfully!");
        setUpcomingSlots(upcomingSlots.filter((slot) => slot.id !== slotId));
      } else {
        alert("Failed to delete the slot.");
      }
    } catch (error) {
      console.error("Error deleting slot:", error);
      alert("An error occurred while deleting the slot.");
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
        <h2 className="text-lg font-semibold mb-2">Available Slots</h2>
        <Select
          onValueChange={handleSlotSelect}
          value={selectedSlot ? selectedSlot.id.toString() : ""}
        >
          <SelectTrigger className="w-full border rounded-lg px-4 py-2 text-left">
            <SelectValue placeholder="Select a time slot" />
          </SelectTrigger>
          <SelectContent>
            {availableSlots.map((slot) => (
              <SelectItem key={slot.id} value={slot.id.toString()}>
                {`${format(slot.startTime, "hh:mm a")} - ${format(
                  slot.endTime,
                  "hh:mm a"
                )}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-4">
          <Button
            variant="default"
            className="w-full text-white rounded-md py-2 hover:bg-zinc-600 transition-all"
            onClick={handleSubmit}
            disabled={!selectedSlot || !selectedDate || loading}
          >
            {loading ? "Adding Slot..." : "Add Slot"}
          </Button>
        </div>
        <h3 className="mt-6 text-md font-semibold">
          Upcoming Slots for{" "}
          {selectedDate ? selectedDate.toDateString() : "Selected Date"}
        </h3>
        <ul className="mt-2 space-y-2 max-h-40 overflow-y-scroll">
          {upcomingSlots.length > 0 ? (
            upcomingSlots.map((slot, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-100 rounded-md border border-gray-200 group" // Added group class here
              >
                <span>{`${format(slot.startTime, "hh:mm a")} - ${format(
                  slot.endTime,
                  "hh:mm a"
                )}`}</span>
                <div className="flex items-center space-x-2">
                  <span>
                    {slot.booking?.studentName
                      ? `Booked by ${slot.booking.studentName}`
                      : "Available"}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Adjusted this div to work with group-hover */}
                    <Trash
                      className="cursor-pointer text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteSlot(slot.id)}
                    />
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">
              No slots available for this date.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OpenSlotsCard;
