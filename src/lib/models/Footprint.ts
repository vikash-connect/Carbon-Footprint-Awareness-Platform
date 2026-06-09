import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod Schema for strict runtime validation of user input
export const footprintSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  date: z.date().default(() => new Date()),
  travel: z.number().min(0, "Travel distance cannot be negative"), // kilometers
  foodType: z.enum(["vegan", "vegetarian", "omnivore", "meat-heavy"]),
  energyUse: z.number().min(0, "Energy use cannot be negative"), // kWh
});

// Infer strict TypeScript types from Zod to avoid 'any'
export type FootprintInput = z.infer<typeof footprintSchema>;

export interface IFootprint extends Document, Omit<FootprintInput, 'date'> {
  date: Date;
}

// Mongoose Schema with indexing for optimized query performance
const FootprintMongooseSchema = new Schema<IFootprint>({
  userId: { type: String, required: true, index: true }, 
  date: { type: Date, default: Date.now, index: true }, 
  travel: { type: Number, required: true },
  foodType: { type: String, enum: ["vegan", "vegetarian", "omnivore", "meat-heavy"], required: true },
  energyUse: { type: Number, required: true },
});

// Compound index for optimizing the dashboard timeline fetch
FootprintMongooseSchema.index({ userId: 1, date: -1 });

export const Footprint = mongoose.models.Footprint || mongoose.model<IFootprint>('Footprint', FootprintMongooseSchema);
