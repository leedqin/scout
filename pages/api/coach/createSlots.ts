import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { startTime, endTime, coachId } = req.body;

    if (!startTime || !endTime || !coachId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const newSlot = await prisma.slot.create({
        data: {
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          coachId: Number(coachId),
          isBooked: false,
        },
      });

      res.status(201).json(newSlot);
    } catch (error) {
      console.error("Error creating slot:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the slot" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
