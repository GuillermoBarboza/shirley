import express, { Request, Response } from "express";
import ContactInfo from "./models/ContactInfo"; // Adjust the path based on your folder structure
import authMiddleware from "./middleware/authMiddleware";

const router = express.Router();

// GET /api/contact-info
router.get("/", async (req: Request, res: Response) => {
    try {
        const contactInfo = await ContactInfo.findOne();
        res.status(200).json(contactInfo);
    } catch (error) {
        console.error("Error fetching contact info:", error);
        res.status(500).json({ message: "Error fetching contact info" });
    }
});

// PUT /api/contact-info — updates only the fields sent, so toggling a site
// switch never touches the phone number and vice versa.
router.put("/", authMiddleware, async (req: Request, res: Response) => {
    const { phoneNumber, wallViewEnabled } = req.body;

    if (phoneNumber !== undefined && typeof phoneNumber !== "string") {
        return res.status(400).json({ message: "Número de contacto inválido." });
    }
    if (wallViewEnabled !== undefined && typeof wallViewEnabled !== "boolean") {
        return res.status(400).json({ message: "Valor inválido para “Ver en tu pared”." });
    }

    try {
        let contactInfo = await ContactInfo.findOne();
        if (!contactInfo) {
            if (!phoneNumber) {
                return res.status(400).json({ message: "Primero cargá un número de contacto." });
            }
            contactInfo = new ContactInfo({ phoneNumber, wallViewEnabled });
        } else {
            if (phoneNumber !== undefined) contactInfo.phoneNumber = phoneNumber;
            if (wallViewEnabled !== undefined) contactInfo.wallViewEnabled = wallViewEnabled;
        }
        await contactInfo.save();
        res.status(200).json(contactInfo);
    } catch (error) {
        console.error("Error updating contact info:", error);
        res.status(500).json({ message: "Error updating contact info" });
    }
});

export default router;
