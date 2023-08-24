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
  coleccion: string;
  url: string;
}

const artworkSchema = new Schema<Artwork>({
  title: { type: String, required: false },
  description: { type: String, required: false },
  artist: { type: String, required: false, default: "Shirley Madero" },
  styles: { type: [String], required: false },
  size: { type: String, required: false },
  price: { type: Number, required: false },
  year: { type: Number, required: false },
  available: { type: Boolean, required: false },
  coleccion: { type: String, required: false },
  url: { type: String, required: true },
});

const ArtworkModel = mongoose.model<Artwork & Document>(
  "Artwork",
  artworkSchema
);

export default ArtworkModel;
