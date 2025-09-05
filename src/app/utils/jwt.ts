import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env";

export const generateToken = (jwtPayload : JwtPayload, secret:string, expiresIn : string) => {
      
    const token = jwt.sign(
           jwtPayload,
           secret as string,
           { expiresIn } as SignOptions
       );

       return token;
};



export const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret);
        return verifiedToken as JwtPayload;
    } catch (error) {
        throw new Error("Invalid token");
    }
};
