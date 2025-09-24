import { Jwt, JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../errors";
import { ENV } from "../../config/env";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/createUserToken";
import { generateToken, verifyToken } from "../../utils/jwt";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer"; 
import { sendEmail } from "../../config/nodemailer";






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


const changePassword = async (decodedToken: JwtPayload, newPassword: string, oldPassword: string) => {

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




const setPassword = async (
  decodedToken: JwtPayload,
  password: string
) => {

  const userEmail = decodedToken.email;
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    throw new AppError("User not found");
  }

  if (user.password) {
    throw new AppError(
      "Password already set. Please use change-password.",
      400
    );
  }

  // hash new password
  const hashedPassword = await bcryptjs.hash(
    password,
    ENV.BCRYPT_SALT_ROUNDS
  );

  // update password
  user.password = hashedPassword;

  // ensure "credentials" provider exists in auths
  const hasCredentialsAuth = user.auths.some(
    (auth) => auth.provider === "credentials"
  );

  if (!hasCredentialsAuth) {
    user.auths.push({
      provider: "credentials",
      providerId: user.email, // ✅ use email as providerId
    });
  }

  await user.save();

  return {
    success: true,
    message: "Password set successfully",
  };
};




export const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isVerified) {
    throw new AppError("User not verified", 400);
  }

  if (user.isDeleted) {
    throw new AppError("User account deleted", 400);
  }

  // short expiry token (10 minutes)
  const resetToken = generateToken(
    {
      userId: user._id,
      password: user.password, // hashed password
      
    },
    ENV.JWT_SECRET,
    "10m"
  );

  const resetLink = `${ENV.FRONTEND_URL}/reset-password?userId=${user._id}?email=${user.email}&token=${resetToken}`;

await sendEmail({
  to: user.email,
  subject: "Reset your password",
  template: "forgetPassword",
  templateData: {
    name: user.name || user.email,
    resetLink,
    expiryMinutes: 10
  }
});


  return {
    success: true,
    message: "Reset link sent",
  };
};





const resetPassword = async (token: string, newPassword: string, id:string) => {
 
    let decoded;
  try {
    
    decoded = verifyToken(token, ENV.JWT_SECRET) as {
    userId: string;
    password: string;
    };

  } catch (err) {
    throw new AppError("Invalid or expired token", 400);
  }

  if(id !== decoded.userId ){
    throw new AppError("You can not reset password");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // check token invalidation (if password already changed)
  if (user.password !== decoded.password) {
    throw new AppError("Invalid or expired token", 400);
  }

  const hashedPassword = await bcryptjs.hash(
    newPassword,
    ENV.BCRYPT_SALT_ROUNDS
  );

  user.password = hashedPassword;
  await user.save();

  return {
    success: true,
    message: "Password reset successfully",
  };
};




export const AuthServices = {
//   credentialLogin,
  getNewAccessToken,
  changePassword,
  setPassword,
  forgetPassword,
  resetPassword,
};