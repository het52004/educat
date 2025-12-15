import express from "express";
import cors from "cors";
import { env } from "./utils/envValues.js";
import { connectDB } from "./db/connectDb.js";

const app = express();

app.use(express.json());
app.use(cors());

const port = env.port;

app.get("/", (req, res) => {
  res.send("Backend server is running");
}); 

app.listen(port, () => {
  console.log(`backend server running on port ${port}`);
  connectDB();
});
