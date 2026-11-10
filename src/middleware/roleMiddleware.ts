import { Request, Response, NextFunction } from "express";
import { IUserRequest } from "../../types/express";

const roleMiddleware = (requiredRole: string) => {
    return (req: IUserRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Access denied." });
        }
        next();
    };
};

export default roleMiddleware;
