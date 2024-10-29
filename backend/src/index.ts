import express, { Request, Response } from "express";
import Booking from "./model";
import { readFileSync } from "fs";
import connectToMongo from "./db";

// Initialize Express app
const app = express();

// Define interface for booking documents
interface BookingDocument {
  hotel: string;
  arrival_date_year: number;
  arrival_date_month: string;
  arrival_date_day_of_month: number;
  adults: number;
  children: number;
  babies: number;
  country: string;
}

// Connect to Database
connectToMongo();

// Seed route
app.get("/seed", async (req: Request, res: Response) => {
  try {
    // Read file
    const rawCsv = readFileSync("./hotel_bookings_1000.csv", "utf8");

    // Parse CSV and map to documents, using destructuring for clarity
    const bookings: BookingDocument[] = rawCsv
      .split(/\r?\n/)
      .slice(1)
      .map((line): BookingDocument => {
        const [hotel, year, month, day, adults, children, babies, country] =
          line.split(",");
        return {
          hotel,
          arrival_date_year: parseInt(year),
          arrival_date_month: month,
          arrival_date_day_of_month: parseInt(day),
          adults: parseInt(adults),
          children: parseInt(children),
          babies: parseInt(babies),
          country,
        };
      });

    // Insert all booking documents at once
    const insertedBookings = await Booking.insertMany(bookings);
    res.status(200).json({
      message: "Database seeded successfully",
      data: insertedBookings,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ message: "Seeding failed", error });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
