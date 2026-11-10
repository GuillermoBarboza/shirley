import express, { Request, Response } from "express";
import { IUserRequest } from "../types/express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import UserModel from "./models/User"; // Adjust the path based on your folder structure
import authMiddleware from "./middleware/authMiddleware";
import roleMiddleware from "./middleware/roleMiddleware";


import { sendEmail, generatePasswordResetEmail } from "./utils/email"

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
router.post("/users/register", authMiddleware, roleMiddleware("admin"), async (req: Request, res: Response) => {
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

// POST /users/forgot-password
router.post("/users/forgot-password", async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        // Where the reset link sends the user. Must be the admin app's public
        // origin in production — set BASE_URL there. Trimmed because the value
        // is easy to save with trailing whitespace, which would corrupt the link.
        const baseUrl = (process.env.BASE_URL || "http://localhost:3000").trim();

        const user = await UserModel.findOne({ email });

        if (!user) {
            // Always show success even if email doesn't exist (security best practice)
            return res.json({
                message:
                    "If an account exists with this email, you'll receive password reset instructions shortly.",
            });
        }

        // Generate secure token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before storing
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Store token with expiry (1 hour from now)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        // Create reset link with the unhashed token
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}&id=${user._id}`;

        // Send email with reset link
        const emailSent = await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            html: generatePasswordResetEmail(user.username || user.email, resetLink)
        });

        if (!emailSent) {
            return res.status(500).json({ message: "Error sending password reset email" });
        }

        return res.json({
            message: "If an account exists with this email, you'll receive password reset instructions shortly."
        });

    } catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ message: "Error sending password reset email" });
    }
}

);

// POST /users/reset-password
router.post("/users/reset-password", async (req: Request, res: Response) => {
    try {
        const { userId, token, newPassword } = req.body;
        
        const user = await UserModel.findById(userId);
        
        if (!user || 
            !user.resetPasswordToken || 
            !user.resetPasswordExpires || 
            user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired" });
        }
        
        // Verify token
        const isValid = await bcrypt.compare(token, user.resetPasswordToken);
        
        if (!isValid) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired" });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        return res.json({ message: "Password has been reset successfully" });
        
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password" });
    }
});

// POST /users/validate-reset-token
router.post("/users/validate-reset-token", async (req: Request, res: Response) => {
    try {
        const { userId, token } = req.body;
        
        const user = await UserModel.findById(userId);
        
        if (!user || 
            !user.resetPasswordToken || 
            !user.resetPasswordExpires || 
            user.resetPasswordExpires < new Date()) {
            return res.json({ valid: false });
        }
        
        // Verify token
        const isValid = await bcrypt.compare(token, user.resetPasswordToken);
        
        return res.json({ valid: isValid });
        
    } catch (error) {
        console.error("Error validating token:", error);
        return res.json({ valid: false });
    }
});

// GET /users
router.get(
    "/users",
    authMiddleware,
    roleMiddleware("admin"),
    async (req: Request, res: Response) => {
        try {
            // Never ship password hashes or live reset tokens to a client.
            const users = await UserModel.find().select(
                "-password -resetPasswordToken -resetPasswordExpires"
            );
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
            const user = await UserModel.findById(req.params.id).select(
                "-password -resetPasswordToken -resetPasswordExpires"
            );
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
