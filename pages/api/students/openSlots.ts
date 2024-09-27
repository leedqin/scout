import { endOfDay, parseISO, startOfDay } from "date-fns";

import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Selected date is required" });
    }

    try {
      const timeZone = "America/New_York";
      const selectedDate = parseISO(date as string);

      const startOfDayInNY = toZonedTime(startOfDay(selectedDate), timeZone);
      const endOfDayInNY = toZonedTime(endOfDay(selectedDate), timeZone);

      console.log(
        "Querying open slots between:",
        formatInTimeZone(startOfDayInNY, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        "and",
        formatInTimeZone(endOfDayInNY, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX")
      );

      const openSlots = await prisma.slot.findMany({
        where: {
          startTime: {
            gte: startOfDayInNY,
            lt: endOfDayInNY,
          },
          isBooked: false,
        },
        orderBy: {
          startTime: "asc",
        },
      });

      res.status(200).json(openSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
