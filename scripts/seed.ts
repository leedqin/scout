/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const coachMartin = await prisma.user.upsert({
    where: { email: "chris.martin@example.com" },
    update: {},
    create: {
      name: "Chris Martin",
      phoneNumber: "123-456-7890",
      email: "chris.martin@example.com",
      isCoach: true,
    },
  });

  const coachBowie = await prisma.user.upsert({
    where: { email: "david.bowie@example.com" },
    update: {},
    create: {
      name: "David Bowie",
      phoneNumber: "987-654-3210",
      email: "david.bowie@example.com",
      isCoach: true,
    },
  });

  const studentAlice = await prisma.user.upsert({
    where: { email: "alice.brown@example.com" },
    update: {},
    create: {
      name: "Alice Brown",
      phoneNumber: "111-222-3333",
      email: "alice.brown@example.com",
      isCoach: false,
    },
  });

  const studentBob = await prisma.user.upsert({
    where: { email: "bob.green@example.com" },
    update: {},
    create: {
      name: "Bob Green",
      phoneNumber: "444-555-6666",
      email: "bob.green@example.com",
      isCoach: false,
    },
  });

  const slots = [
    {
      startTime: new Date("2024-10-01T09:00:00Z"),
      endTime: new Date("2024-10-01T11:00:00Z"),
      coachId: coachMartin.id,
    },
    {
      startTime: new Date("2024-10-02T13:00:00Z"),
      endTime: new Date("2024-10-02T15:00:00Z"),
      coachId: coachBowie.id,
    },
    {
      startTime: new Date("2024-10-03T10:00:00Z"),
      endTime: new Date("2024-10-03T12:00:00Z"),
      coachId: coachMartin.id,
    },
    {
      startTime: new Date("2024-10-04T15:00:00Z"),
      endTime: new Date("2024-10-04T17:00:00Z"),
      coachId: coachMartin.id,
    },
    {
      startTime: new Date("2024-10-05T09:00:00Z"),
      endTime: new Date("2024-10-05T11:00:00Z"),
      coachId: coachBowie.id,
    },
    {
      startTime: new Date("2024-10-06T14:00:00Z"),
      endTime: new Date("2024-10-06T16:00:00Z"),
      coachId: coachBowie.id,
    },
  ];

  // Create slots with related coach information
  for (const slot of slots) {
    await prisma.slot.create({
      data: {
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: false,
        coach: {
          connect: { id: slot.coachId },
        },
      },
    });
  }

  const allSlots = await prisma.slot.findMany({
    include: {
      coach: true,
    },
  });

  // Create bookings for the students with related slot and coach information
  const booking1 = await prisma.booking.create({
    data: {
      student: {
        connect: { id: studentAlice.id },
      },
      slot: {
        connect: { id: allSlots[0].id },
      },
      needsReview: true,
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      student: {
        connect: { id: studentBob.id },
      },
      slot: {
        connect: { id: allSlots[1].id },
      },
      needsReview: false,
    },
  });

  // Add feedback for each booking
  await prisma.feedback.create({
    data: {
      booking: {
        connect: { id: booking1.id },
      },
      score: 5,
      notes: "Alice is responsive and making progress in the modules",
    },
  });

  await prisma.feedback.create({
    data: {
      booking: {
        connect: { id: booking2.id },
      },
      score: 4,
      notes: "Bob needs to review the study materials a bit more",
    },
  });

  // Fetch bookings to ensure student and slot information is included
  const allBookings = await prisma.booking.findMany({
    include: {
      student: true, // Include student details in the booking
      slot: {
        include: {
          coach: true, // Include coach details in the slot
        },
      },
      feedback: true,
    },
  });

  console.log("Bookings with detailed information: ", allBookings);
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
