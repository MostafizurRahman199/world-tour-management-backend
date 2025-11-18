// src/app/services/otp.service.ts


import { CacheService } from "./cache.service";
import { sendEmail } from "../../config/nodemailer";
import { ENV } from "../../config/env";
import { generateOTP } from "../../utils/generateOTP";
import { User } from "../user/user.model";
import { AppError } from "../../../errors";



export async function sendOTP(email: string): Promise<string> {
 
  const user = await User.findOne({email});
  
  if(!user){
    throw new AppError("User not Found");
  }

  if(user.isVerified){
    throw new AppError("You are already verified");
  }
  const name = user.name;
  const otp = await generateOTP();

  // Store OTP in Redis
  await CacheService.set(`otp:${email}`, otp, ENV.OTP_TTL_SECONDS);

  // Send OTP email
  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    template: "otpTemplates",
    templateData: {
      name,
      email,
      otp,
      year: new Date().getFullYear(),
    },
  });

  // console.log(`OTP sent to ${email}: ${otp}`);
  return otp;
}





export async function verifyOTP(email: string, otp: string): Promise<boolean> {

  const user = await User.findOne({email});
  
  if(!user){
    throw new AppError("User not Found");
  }

  if(user.isVerified){
    throw new AppError("You are already verified");
  }


  const cachedOTP = await CacheService.get<string>(`otp:${email}`);
  
  if (!cachedOTP) return false;

  const isValid = cachedOTP === otp;

  if (isValid){
    await User.findOneAndUpdate(
      { email },
      { $set: { isVerified: true } },
      { new: true }
    );
    await CacheService.del(`otp:${email}`);
  } 
    

  return isValid;
}
