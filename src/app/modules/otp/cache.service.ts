// src/app/config/cache.service.ts

import { getRedisClient } from "../../config/redis.config";


export const CacheService = {

    async set(key: string, value: unknown, ttlSeconds?: number) {

      const client = await getRedisClient();
      const stringValue = JSON.stringify(value);

      if (ttlSeconds) {

        await client.set(key, stringValue, { EX: ttlSeconds });

      } else {

        await client.set(key, stringValue);

      }
  },

  async get<T>(key: string): Promise<T | null> {

    const client = await getRedisClient();

    const data = await client.get(key);

    return data ? (JSON.parse(data) as T) : null;

  },

  async del(key: string) {

    const client = await getRedisClient();
    await client.del(key);


  },
};
