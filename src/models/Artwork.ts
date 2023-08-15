import mongoose, { Schema, Document } from "mongoose";

interface Artwork {
  title: string;
  artist: string;
  styles: string[];
  year: number;
}

const artworkSchema = new Schema<Artwork>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  styles: { type: [String], required: true },
  year: { type: Number, required: true },
});

const ArtworkModel = mongoose.model<Artwork & Document>(
  "Artwork",
  artworkSchema
);

export default ArtworkModel;
