import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { coachId } = req.query;

    try {
      const openSlots = await prisma.slot.findMany({
        where: {
          coachId: Number(coachId),
          isBooked: false,
        },
        orderBy: {
          startTime: "asc",
        },
      });
      res.status(200).json(openSlots);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
