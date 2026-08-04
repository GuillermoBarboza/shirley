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

// PUT /api/contact-info
router.put("/", authMiddleware, async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;

    try {
        let contactInfo = await ContactInfo.findOne();
        if (!contactInfo) {
            contactInfo = new ContactInfo({ phoneNumber });
        } else {
            contactInfo.phoneNumber = phoneNumber;
        }
        await contactInfo.save();
        res.status(200).json(contactInfo);
    } catch (error) {
        console.error("Error updating contact info:", error);
        res.status(500).json({ message: "Error updating contact info" });
    }
});

export default router;
