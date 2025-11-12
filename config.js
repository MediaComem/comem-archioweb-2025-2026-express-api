import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

export const bcryptCostFactor = 10;
export const databaseUrl =
  process.env.DATABASE_URL || "mongodb://localhost/express-api";
export const port = process.env.PORT || 3000;
export const secretKey = process.env.SECRET_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!secretKey) {
  throw new Error("SECRET_KEY environment variable is not set.");
}

// Validate that port is a positive integer.
if (process.env.PORT) {
  const parsedPort = parseInt(process.env.PORT, 10);
  if (!Number.isInteger(parsedPort)) {
    throw new Error("Environment variable $PORT must be an integer");
  } else if (parsedPort < 1 || parsedPort > 65535) {
    throw new Error("Environment variable $PORT must be a valid port number");
  }
}
