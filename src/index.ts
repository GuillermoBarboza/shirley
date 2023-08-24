import express, { Request, Response } from "express";
import mongoose from "mongoose";
import routes from "./routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3009;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

// Routes
app.use("/artworks", routes);

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the allowed origin(s)
  })
);

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
