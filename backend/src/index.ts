import express, { Request, Response } from "express";
import Booking from "./model";
import { readFileSync } from "fs";
import connectToMongo from "./db";

// Initialize Express app
const app = express();

// Connect to Database
connectToMongo();

// Seed route
app.get("/seed", async (req: Request, res: Response) => {
  try {
    const rawCsv = readFileSync("./hotel_bookings_1000.csv", "utf8");
    const bookings = rawCsv
      .split(/\r?\n/)
      .slice(1)
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [hotel, year, month, day, adults, children, babies, country] =
          line.split(",");
        return {
          hotel,
          arrival_date: new Date(`${year}-${month}-${day}`), // Combine into Date
          adults: parseInt(adults),
          children: parseInt(children),
          babies: parseInt(babies),
          country,
        };
      });

    await Booking.insertMany(bookings);
    res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ message: "Seeding failed", error });
  }
});

app.get("/range", async (req: Request, res: Response) => {
  const { from, to } = req.query;

  try {
    let filter = {};

    if (from || to) {
      filter = {
        arrival_date: {
          ...(from ? { $gte: new Date(from as string) } : {}),
          ...(to ? { $lte: new Date(to as string) } : {}),
        },
      };
    }

    const data = await Booking.find(filter).sort({ arrival_date: 1 });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching range:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
