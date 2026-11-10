import express, { Request, Response } from "express";
import ExperiencesPage, { IExperience } from "./models/ExperiencesPage";
import { experiencesDefaults } from "./experiencesDefaults";
import authMiddleware from "./middleware/authMiddleware";
import roleMiddleware from "./middleware/roleMiddleware";

const router = express.Router();

const isString = (value: unknown): value is string =>
    typeof value === "string";

/** Spanish message for the first problem found, or null if the page is valid. */
const validatePage = (body: unknown): string | null => {
    const { intro, experiences } = (body ?? {}) as Record<string, unknown>;
    const i = (intro ?? {}) as Record<string, unknown>;
    if (!isString(i.eyebrow) || !isString(i.title) || !isString(i.lede)) {
        return "El encabezado de la página está incompleto.";
    }
    if (!Array.isArray(experiences)) {
        return "Formato de experiencias inválido.";
    }
    for (const raw of experiences) {
        const e = (raw ?? {}) as Record<string, unknown>;
        if (!isString(e.title) || !e.title.trim()) {
            return "Cada experiencia necesita un título.";
        }
        if (e.accent !== "olive" && e.accent !== "gold") {
            return "Color inválido.";
        }
        if (
            e.steps !== undefined &&
            (!Array.isArray(e.steps) || !e.steps.every(isString))
        ) {
            return "Los pasos deben ser una lista de textos.";
        }
    }
    return null;
};

// GET /api/experiences — public. Hidden experiences never leave the server.
router.get("/", async (req: Request, res: Response) => {
    try {
        const page = await ExperiencesPage.findOne();
        const source = page ? page.toObject() : experiencesDefaults;
        res.status(200).json({
            intro: source.intro,
            experiences: source.experiences.filter(
                (e: IExperience) => e.visible
            ),
        });
    } catch (error) {
        console.error("Error fetching experiences:", error);
        res.status(500).json({ message: "Error fetching experiences" });
    }
});

// GET /api/experiences/admin — everything, hidden drafts included.
router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    async (req: Request, res: Response) => {
        try {
            const page = await ExperiencesPage.findOne();
            res.status(200).json(page ?? experiencesDefaults);
        } catch (error) {
            console.error("Error fetching experiences:", error);
            res.status(500).json({ message: "Error fetching experiences" });
        }
    }
);

// PUT /api/experiences — replaces the whole page.
router.put(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    async (req: Request, res: Response) => {
        const { intro, experiences } = req.body;

        const invalid = validatePage(req.body);
        if (invalid) {
            return res.status(400).json({ message: invalid });
        }

        try {
            let page = await ExperiencesPage.findOne();
            if (!page) {
                page = new ExperiencesPage({ intro, experiences });
            } else {
                page.intro = intro;
                page.set("experiences", experiences);
            }
            await page.save();
            res.status(200).json(page);
        } catch (error) {
            console.error("Error updating experiences:", error);
            res.status(500).json({ message: "Error updating experiences" });
        }
    }
);

export default router;
