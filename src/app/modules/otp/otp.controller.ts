// src/app/controllers/otp.controller.ts
import { Request, Response } from "express";
import * as OTPService from "./otp.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


/**
 * Send OTP
 */


const sendOTP = catchAsync(async (req: Request, res: Response) => {
  
  const { email} = req.body;

  if (!email) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Email is required",
    });
  }

  await OTPService.sendOTP(email);

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP sent successfully",
    data:null,
  });
});



/**
 * Verify OTP
 */



const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  
  const { email, otp } = req.body;

  if (!email || !otp) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "phoneOrEmail and otp are required",
    });
  }

  const isValid = await OTPService.verifyOTP(email, otp);

  if (!isValid) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Invalid or expired OTP",
    });
  }

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP verified successfully",
    data:null,
  });
});

export const OTPController = {
  sendOTP,
  verifyOTP,
};
