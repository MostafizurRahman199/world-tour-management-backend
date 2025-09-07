import { Jwt, JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../errors";
import { ENV } from "../../config/env";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/createUserToken";
import { generateToken, verifyToken } from "../../utils/jwt";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";






// const credentialLogin = async (payload: Partial<IUser>)=>{

//     const {email, password} = payload;
//     const isUserExist = await User.findOne({ email });

//     if (!isUserExist) {
//     throw new AppError("User not found");
//     }

//     const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string);

//     if (!isPasswordMatch) {
//         throw new AppError("Invalid password");
//     }


//     const { accessToken, refreshToken } = createUserToken(isUserExist);
//     const {password:pass, ...user} = isUserExist.toObject();


//     return {
//        accessToken,
//        refreshToken,
//        user 
//     };
// }





const getNewAccessToken = async (refreshToken: string) => {

    const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken,
    };
}


const resetPassword = async (decodedToken: JwtPayload, newPassword: string, oldPassword: string) => {

    const userEmail = decodedToken.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
        throw new AppError("User not found");
    }

    if(!user.password) {
        throw new AppError("User password not found");
    }

    const isOldPasswordMatch = bcryptjs.compare(oldPassword, user.password);

    if (!isOldPasswordMatch) {
        throw new AppError("Old password is incorrect");
    }

    const hashNewPassword = await bcryptjs.hash(newPassword as string, ENV.BCRYPT_SALT_ROUNDS);

    user.password = hashNewPassword;
    await user.save();


    return {
        success: true,
        message: "Password reset successfully",
    };
};



export const AuthServices = {
//   credentialLogin,
  getNewAccessToken,
  resetPassword
};