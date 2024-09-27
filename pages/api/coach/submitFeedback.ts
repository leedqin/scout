import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { bookingId, score, notes } = req.body;

    try {
      const feedback = await prisma.feedback.upsert({
        where: {
          bookingId: bookingId,
        },
        update: {
          score,
          notes,
        },
        create: {
          bookingId: bookingId,
          score,
          notes,
        },
      });

      await prisma.booking.update({
        where: { id: bookingId },
        data: { needsReview: false },
      });

      res.status(200).json(feedback);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
