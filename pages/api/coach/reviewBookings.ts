import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { coachId } = req.query;

    try {
      const reviewedBookings = await prisma.booking.findMany({
        where: {
          needsReview: true,
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
            startTime: "desc",
          },
        },
      });
      res.status(200).json(reviewedBookings);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
