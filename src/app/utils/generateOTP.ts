
import crypto from "crypto";

export async function generateOTP(length = 6): Promise<string> {
  return crypto.randomInt(0, 10 ** length).toString().padStart(length, "0");
}