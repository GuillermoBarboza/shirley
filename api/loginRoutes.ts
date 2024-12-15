import express, { Request, Response } from "express";
import { IUserRequest } from "../types/express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "./models/User"; // Adjust the path based on your folder structure
import authMiddleware from "./middleware/authMiddleware";
import roleMiddleware from "./middleware/roleMiddleware";

const router = express.Router();

// POST /users/verify-token
router.get(
    "/verify-token",
    authMiddleware,
    (req: IUserRequest, res: Response) => {
        res.json({ role: req.user.role });
    }
);

// POST /users/register
router.post("/users/register", async (req: Request, res: Response) => {
    try {
        const { email, password, username, role } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            email,
            username,
            password: hashedPassword,
            role,
        });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// POST /users/login
router.post("/users/login", async (req: IUserRequest, res: Response) => {
    try {
        const { emailOrUsername, password } = req.body;
        console.log("emailOrUsername", emailOrUsername);
        const user = await UserModel.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(400)
                .json({ message: "Invalid email/username or password" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "30d" } // Token expires in 30 days
        );

        res.json({ token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user" });
    }
});

// GET /users
router.get(
    "/users",
    authMiddleware,
    roleMiddleware("admin"),
    async (req: Request, res: Response) => {
        try {
            const users = await UserModel.find();
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ message: "Error fetching users" });
        }
    }
);

// GET /users/:id
router.get(
    "/users/:id",
    authMiddleware,
    roleMiddleware("admin"),
    async (req: Request, res: Response) => {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ message: "Error fetching user" });
        }
    }
);

// PUT /users/:id
router.put(
    "/users/:id",
    authMiddleware,
    roleMiddleware("admin"),
    async (req: Request, res: Response) => {
        try {
            const { email, password, role } = req.body;

            // Hash the password before updating
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await UserModel.findByIdAndUpdate(
                req.params.id,
                { email, password: hashedPassword, role },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Error updating user" });
        }
    }
);

// DELETE /users/:id
router.delete(
    "/users/:id",
    authMiddleware,
    roleMiddleware("admin"),
    async (req: Request, res: Response) => {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ message: "Error deleting user" });
        }
    }
);

export default router;
