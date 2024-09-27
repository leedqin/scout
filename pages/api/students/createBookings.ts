import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { studentId, slotId } = req.body;

    try {
      const slot = await prisma.slot.findUnique({
        where: { id: slotId },
      });

      if (!slot || slot.isBooked) {
        return res.status(400).json({ error: "Slot is not available" });
      }

      const booking = await prisma.booking.create({
        data: {
          studentId,
          slotId,
        },
      });

      await prisma.slot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
