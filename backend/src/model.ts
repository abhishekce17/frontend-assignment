import mongoose, { Document, Schema } from "mongoose";

interface IBooking extends Document {
  hotel: string;
  arrival_date: Date;
  adults: number;
  children: number;
  babies: number;
  country: string;
}

const BookingSchema: Schema = new Schema({
  hotel: { type: String, required: true },
  arrival_date: { type: Date, required: true },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, default: 0 },
  babies: { type: Number, default: 0 },
  country: { type: String, required: true, trim: true },
});

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
