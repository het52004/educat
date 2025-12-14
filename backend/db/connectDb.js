import mongoose from "mongoose";
import { env } from "../utils/envValues.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.database_url);
    console.log(`Database Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};