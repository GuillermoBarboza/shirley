import mongoose, { Schema, Document } from "mongoose";

interface Artwork {
  title: string;
  description: string;
  artist: string;
  styles: string[];
  size: string;
  price: number;
  year: number;
  available: boolean;
  collection: string;
  url: string;
}

const artworkSchema = new Schema<Artwork>({
  title: { type: String, required: false },
  artist: { type: String, required: false, default: "Shirley Madero" },
  styles: { type: [String], required: false },
  size: { type: String, required: false },
  collection: { type: String, required: false },
  year: { type: Number, required: false },
  price: { type: Number, required: false },
  url: { type: String, required: true },
  available: { type: Boolean, required: false },
  description: { type: String, required: false },
});

const ArtworkModel = mongoose.model<Artwork & Document>(
  "Artwork",
  artworkSchema
);

export default ArtworkModel;
