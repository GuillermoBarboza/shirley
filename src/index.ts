import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import usersRoutes from "./routes/router";
import router from "./routes/router";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to the database");
});
db.on("error", (error) => {
  console.error("Error connecting to the database:", error);
});

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/artworks", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
