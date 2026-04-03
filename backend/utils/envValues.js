import { configDotenv } from "dotenv";

configDotenv();

export const env = {
  port: process.env.PORT,
  database_url: process.env.MONGO_URI,
  gmail: process.env.GMAIL,
  gmail_app_password: process.env.GMAIL_APP_PASSWORD,
  jwt_secret: process.env.JWT_SECRET,
};
