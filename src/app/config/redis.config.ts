
//redis.config.ts
import { createClient } from "redis";
import { ENV } from "./env";

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {

  if (!redisClient) {
    redisClient = createClient({
      username: ENV.REDIS_USERNAME,
      password: ENV.REDIS_PASSWORD,
      socket: {
        host: ENV.REDIS_HOST,
        port: Number(ENV.REDIS_PORT),
      },
    });


    redisClient.on("error", (err) => {
      console.error("❌ Redis Client Error:", err);
    });


    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis connected successfully");
    }
  }

  return redisClient;
}
