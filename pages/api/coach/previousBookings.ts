import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { coachId } = req.query;

    try {
      const previousBookings = await prisma.booking.findMany({
        where: {
          needsReview: false,
          slot: {
            coachId: Number(coachId),
          },
        },
        include: {
          student: true,
          slot: true,
          feedback: true,
        },
      });
      res.status(200).json(previousBookings);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
