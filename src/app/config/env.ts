// env.ts
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();




/**
 * Helper to get environment variables with validation
 */
function getEnvVar(key: string, required = true, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (required && (value === undefined || value === '')) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value ?? '';
}




/**
 * Application environment variables
 */
export const ENV = {
  PORT: Number(getEnvVar('PORT', false, '5000')),
  DB_URI: getEnvVar('DB_URI'), // Required
  NODE_ENV: getEnvVar('NODE_ENV', false, 'development'),
  IS_PRODUCTION: getEnvVar('NODE_ENV', false, 'development') === 'production',
};
