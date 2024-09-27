import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { coachId } = req.query;

    try {
      const bookings = await prisma.booking.findMany({
        where: {
          slot: {
            coachId: Number(coachId),
          },
        },
        include: {
          student: true,
          slot: true,
          feedback: true,
        },
        orderBy: {
          slot: {
            startTime: "asc",
          },
        },
      });
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
