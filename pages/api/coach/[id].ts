import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const coach = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          slots: true,
        },
      });

      if (!coach || !coach.isCoach) {
        return res.status(404).json({ error: "Coach not found" });
      }

      res.status(200).json(coach);
    } catch (error) {
      console.error("Error fetching coach information:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
