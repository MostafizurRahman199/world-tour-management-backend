import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env";

export const generateToken = (jwtPayload : JwtPayload, expiresIn : string) => {
      
    const accessToken = jwt.sign(
           jwtPayload,
           process.env.JWT_SECRET as string,
           { expiresIn } as SignOptions
       );

       return accessToken;
};



export const verifyToken = (token: string) => {
    try {
        const verifiedToken = jwt.verify(token, ENV.JWT_SECRET);
        return verifiedToken as JwtPayload;
    } catch (error) {
        throw new Error("Invalid token");
    }
};
