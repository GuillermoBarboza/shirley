import express, { Request, Response } from "express";
import ArtworkModel from "./models/Artwork";

const router = express.Router();

// GET /artworks
router.get("/", async (req: Request, res: Response) => {
  try {
    const artworks = await ArtworkModel.find();
    console.log(artworks);
    res.json(artworks);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    res.status(500).json({ message: "Error fetching artworks" });
  }
});

// POST /artworks/create
router.post("/create", async (req: Request, res: Response) => {
  try {
    const {
      title,
      artist,
      styles,
      year,
      url,
      available,
      description,
      price,
      size,
      coleccion,
    } = req.body;

    const artwork = new ArtworkModel({
      title,
      artist,
      styles,
      year,
      url,
      available,
      description,
      price,
      size,
      coleccion,
    });

    const createdArtwork = await artwork.save();
    res.status(201).json(createdArtwork);
  } catch (error) {
    console.error("Error creating artwork:", error);
    res.status(500).json({ message: "Error creating artwork" });
  }
});

// PUT /artwork/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      artist,
      styles,
      year,
      url,
      available,
      description,
      price,
      size,
      coleccion,
    } = req.body;

    const updatedArtwork = await ArtworkModel.findByIdAndUpdate(
      id,
      {
        title,
        artist,
        styles,
        year,
        url,
        available,
        price,
        size,
        description,
        coleccion,
      },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.json(updatedArtwork);
  } catch (error) {
    console.error("Error updating artwork:", error);
    res.status(500).json({ message: "Error updating artwork" });
  }
});

// DELETE /artwork/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedArtwork = await ArtworkModel.findByIdAndDelete(id);

    if (!deletedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    res.status(500).json({ message: "Error deleting artwork" });
  }
});

export default router;
