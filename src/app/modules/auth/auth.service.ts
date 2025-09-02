import { AppError } from "../../../errors";
import { ENV } from "../../config/env";
import { generateToken } from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";






const credentialLogin = async (payload: Partial<IUser>)=>{

    const {email, password} = payload;
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
    throw new AppError("User not found");
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string);

    if (!isPasswordMatch) {
        throw new AppError("Invalid password");
    }

    const jwtPayload = {
        userId : isUserExist._id,
        email: isUserExist.email,
        role:isUserExist.role,

    }

    const accessToken = generateToken(jwtPayload, ENV.JWT_ACCESS_EXPIRES_IN);

    return {
       accessToken
    };
}


export const AuthServices = {
  credentialLogin
};