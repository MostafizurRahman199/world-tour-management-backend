import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../app/utils/jwt";
import { AppError } from "../errors";
import { NextFunction, Request, Response } from "express";



export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError("Access token is missing");
        }

        const verifiedToken = verifyToken(accessToken);

        console.log(verifiedToken);

        if (!verifiedToken) {
            throw new AppError("Invalid token, and token is : " + { verifiedToken });
        }

        if (!authRoles.includes((verifiedToken as JwtPayload).role)) {
            throw new AppError("Unauthorized to access this resource");
        }

        req.user = verifiedToken;
        
        next();
    } catch (error) {
        next(error);
    }
};
