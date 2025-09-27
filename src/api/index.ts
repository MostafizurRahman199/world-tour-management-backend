import app from "../app"; // adjust if path is different
import mongoose from "mongoose";
import { ENV } from "../app/config/env";
import { getRedisClient } from "../app/config/redis.config";
import { seedSuperAdmin } from "../app/utils/seedSuperAdmin";

// Track DB connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(ENV.DB_URI);
  await getRedisClient();
  await seedSuperAdmin();

  isConnected = true;
}

// Vercel handler
export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res); // let Express handle requests
}
