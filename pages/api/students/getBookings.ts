import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    try {
      const upcomingBookings = await prisma.booking.findMany({
        where: {
          studentId: Number(studentId),
          slot: {
            startTime: {
              gte: new Date(),
            },
          },
        },
        include: {
          slot: true,
          feedback: true,
          student: true,
        },
        orderBy: {
          slot: {
            startTime: "asc",
          },
        },
      });

      res.status(200).json(upcomingBookings);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
