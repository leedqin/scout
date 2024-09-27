import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ error: "Slot ID is required" });
    }

    try {
      const slot = await prisma.slot.findUnique({
        where: { id: Number(slotId) },
      });

      if (!slot) {
        return res.status(404).json({ error: "Slot not found" });
      }

      // If the slot is booked then prevent deletion
      if (slot.isBooked) {
        return res
          .status(400)
          .json({ error: "Cannot delete a slot that is already booked" });
      }

      await prisma.slot.delete({
        where: { id: Number(slotId) },
      });

      res.status(200).json({ message: "Slot deleted successfully" });
    } catch (error) {
      console.error("Error deleting slot:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the slot" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
