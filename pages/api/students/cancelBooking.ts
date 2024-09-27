import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { bookingId } = req.body;

    try {
      // Find the booking by ID
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      await prisma.slot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      });

      await prisma.booking.delete({
        where: { id: bookingId },
      });

      res.status(200).json({ message: "Booking canceled successfully" });
    } catch (error) {
      console.error("Error canceling booking:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
