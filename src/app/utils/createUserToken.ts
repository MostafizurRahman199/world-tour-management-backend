import { JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import { AppError } from "../../errors";
import { is } from "zod/locales";




export const createUserToken = (user: Partial<IUser>) => {
   
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateToken(jwtPayload, ENV.JWT_SECRET, ENV.JWT_ACCESS_EXPIRES_IN);
    const refreshToken = generateToken(jwtPayload, ENV.JWT_REFRESH_SECRET, ENV.JWT_REFRESH_EXPIRES_IN);

    return {
        accessToken,
        refreshToken,
       
    };
};






export const createNewAccessTokenWithRefreshToken = async(refreshToken:string)=>{
   
    const verifiedRefreshToken = verifyToken(refreshToken, ENV.JWT_REFRESH_SECRET) as JwtPayload;

    const isUserExist = await User.findOne({email: verifiedRefreshToken.email});

    // console.log(isUserExist);

    if (!isUserExist) {
        throw new AppError("User not found");
    }

    if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(`User is ${isUserExist.isActive}`);
    }

    if(isUserExist.isDeleted) {
        throw new AppError("User is deleted");
    }


    const payload = {
        id: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };


    // console.log(payload);



    const accessToken = generateToken(payload, ENV.JWT_SECRET, ENV.JWT_ACCESS_EXPIRES_IN);


    return accessToken;
}
