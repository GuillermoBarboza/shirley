import express, { Request, Response } from "express";
import ArtworkModel from "../models/Artwork";

const router = express.Router();

// GET /artwork/all
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

// POST /artwork/create
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { title, artist, styles, year } = req.body;

    const artwork = new ArtworkModel({
      title,
      artist,
      styles,
      year,
    });

    const createdArtwork = await artwork.save();
    res.status(201).json(createdArtwork);
  } catch (error) {
    console.error("Error creating artwork:", error);
    res.status(500).json({ message: "Error creating artwork" });
  }
});

// PUT /artwork/:id
router.put("/:id", (req: Request, res: Response) => {});

// DELETE /artwork/:id
router.delete("/:id", (req: Request, res: Response) => {});

export default router;
