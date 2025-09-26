import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../app/utils/jwt";
import { AppError } from "../errors";
import { NextFunction, Request, Response } from "express";
import { ENV } from "../app/config/env";
import { User } from "../app/modules/user/user.model";
import { IsActive } from "../app/modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) =>
async (req: Request, res: Response, next: NextFunction) => {

    try {
        
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError("Access token is missing");
      }

      const verifiedToken = verifyToken(accessToken, ENV.JWT_SECRET);

      // console.log(verifiedToken);

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      // console.log(isUserExist);

      if (!isUserExist) {
        throw new AppError("User not found");
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(`User is ${isUserExist.isActive}`);
      }

      if (isUserExist.isDeleted) {
        throw new AppError("User is deleted");
      }

      if(!isUserExist.isVerified){
        throw new AppError('User is not verified');
      }

      if (!verifiedToken) {
        throw new AppError(
          "Invalid token, and token is : " + { verifiedToken }
        );
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
