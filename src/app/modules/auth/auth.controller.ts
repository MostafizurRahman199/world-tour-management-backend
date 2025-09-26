//src/app/modules/auth/auth.controller.ts

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





// const credentialLogin = catchAsync(async (req: Request, res: Response) => {

//     // const loginInfo = await AuthServices.credentialLogin(req.body);

//     passport.authenticate()

 

//     setAuthCookies(res, loginInfo);

//     sendResponse(res, {
//         success: true,
//         statusCode: 201,
//         message: "User logged in successfully",
//         data: loginInfo,
//     });
// });



const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  passport.authenticate("local",  
    
    async (err : any, user:any, info:any) => {

    if (err) {
        // Strategy threw an unexpected error
        return next(new AppError(err.message || "Authentication error", 500));
      }

    if (!user) {
        return next(new AppError(info.message || "Authentication failed", 401));
    }

    const userToken = createUserToken(user);
    const {password, ...loginInfo} = user.toObject();

    setAuthCookies(res, userToken);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: loginInfo
      },
    });
  })(req, res, next);
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




const changePassword = catchAsync(async (req: Request, res: Response) => {

    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    await AuthServices.changePassword(decodedToken as JwtPayload, 
        newPassword as string, oldPassword as string);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Password reset successfully",
        data: null,
    });
});




//set password controller who have signup by google

const setPassword = catchAsync(async (req: Request, res: Response) => {
 
    const decodedToken = req.user;
    const password = req.body.password;

  if (!password) {
    throw new AppError("New password is required", 400);
  }

  await AuthServices.setPassword(decodedToken as JwtPayload, password);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Password set successfully",
    data: null,
  });
});



const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email} = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  await AuthServices.forgetPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password reset link sent to your email",
    data: null,
  });
});






// reset controller 
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  // Get token from headers
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Reset token is required in Authorization header", 400);
  }

  // If format is "Bearer <token>", extract the actual token
  let token: string;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = authHeader; // accept raw token as well
  }

  const { newPassword, userId } = req.body;
  if (!newPassword) {
    throw new AppError("New password is required", 400);
  }

  await AuthServices.resetPassword(token, newPassword, userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password reset successfully",
    data: null,
  });
});




//orginal

const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
   

    let redirectTo = req.query.state ? req.query.state as string : "";

    if(redirectTo.startsWith("/")){
       redirectTo = redirectTo.slice(1);
    }

    const user = req.user;
    // console.log(user);

    if(!user) {
        throw new AppError("User not found");
    }

    const tokenInfo =  createUserToken(user);
    setAuthCookies(res, tokenInfo);

    res.redirect(`${ENV.FRONTEND_URL}/${redirectTo}`);

};


//for see the error
// export const googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {

//   passport.authenticate("google", { session: false }, (err, user, info) => {
    
//     let redirectTo = req.query.state ? (req.query.state as string) : "";

//     if (redirectTo.startsWith("/")) {
//       redirectTo = redirectTo.slice(1);
//     }

//     // ❌ Failure
//     if (err || !user) {
//       const errorMessage = info?.message || "Authentication failed";
//       return res.redirect(
//         `${ENV.FRONTEND_URL}/login?error=${encodeURIComponent(errorMessage)}`
//       );
//     }

//     // console.log(user)
//     // ✅ Success → issue token + set cookies
//     const tokenInfo = createUserToken(user);
//     setAuthCookies(res, tokenInfo);

//     res.redirect(`${ENV.FRONTEND_URL}/${redirectTo}`);
//   })(req, res, next);
// };









export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
  logout,
  changePassword,
  googleAuthCallback,
  setPassword,
  forgetPassword,
  resetPassword,
};