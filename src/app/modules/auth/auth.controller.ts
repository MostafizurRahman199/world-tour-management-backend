import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { AppError } from "../../../errors";
import { clearCookie, setAuthCookies } from "../../utils/setCookies";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { createUserToken } from "../../utils/createUserToken";
import { ENV } from "../../config/env";





const credentialLogin = catchAsync(async (req: Request, res: Response) => {

    const loginInfo = await AuthServices.credentialLogin(req.body);

    setAuthCookies(res, loginInfo);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "User logged in successfully",
        data: loginInfo,
    });
});




const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {

    const refreshToken: string = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError("Refresh token not found");
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

     res.cookie("accessToken", tokenInfo.accessToken, {
        httpOnly: true,
        secure: false,
    });

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "New access token generated successfully",
        data: tokenInfo,
    });
});




const logout = catchAsync(async (req: Request, res: Response) => {

    clearCookie(res);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "User logged out successfully",
        data: null,
    });
});




const resetPassword = catchAsync(async (req: Request, res: Response) => {

    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    await AuthServices.resetPassword(decodedToken as JwtPayload, 
        newPassword as string, oldPassword as string);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Password reset successfully",
        data: null,
    });
});





const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
   

    let redirectTo = req.query.state ? req.query.state as string : "";

    if(redirectTo.startsWith("/")){
       redirectTo = redirectTo.slice(1);
    }

    const user = req.user;
    console.log(user);

    if(!user) {
        throw new AppError("User not found");
    }

    const tokenInfo =  createUserToken(user);
    setAuthCookies(res, tokenInfo);

    res.redirect(`${ENV.FRONTEND_URL}/${redirectTo}`);

};












export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleAuthCallback
};