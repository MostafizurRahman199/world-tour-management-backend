import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";





const credentialLogin = catchAsync(async (req: Request, res: Response) => {

    const loginInfo = await AuthServices.credentialLogin(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "User logged in successfully",
        data: loginInfo,
    });
});



export const AuthControllers = {
  credentialLogin
};