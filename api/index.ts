import express, { Request, Response } from "express";
import mongoose from "mongoose";
import routes from "../src/routes";
import loginRoutes from "../src/loginRoutes";
import contactRoutes from "../src/contactRoutes";
import experiencesRoutes from "../src/experiencesRoutes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// Honour PORT so the runner scripts (and any host that assigns one) work;
// 3009 stays the local default the frontends' .env files point at.
const port = Number(process.env.PORT) || 3009;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/api", (req: Request, res: Response) => {
    res.send("Hello, world!");
});

// Routes
app.use("/api/artworks", routes);

app.use("/api/auth", loginRoutes);

app.use("/api/contact-info", contactRoutes);

app.use("/api/experiences", experiencesRoutes);

// MongoDB setup
const mongoURI = process.env.MONGO_URI;

mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
        // Start the server after successfully connecting to MongoDB
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
