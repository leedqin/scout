export interface Coach {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface Slot {
  id: number;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  coachId: number;
  booking?: BookingSummary;
}

export interface BookingSummary {
  id: number;
  studentName?: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface Booking {
  id: number;
  student: Student;
  studentId: number;
  slot: Slot;
  slotId: number;
  feedback?: Feedback;
  needsReview: boolean;
}

export interface Feedback {
  id: number;
  bookingId: number;
  booking: Booking;
  notes?: string;
  score: number;
}
