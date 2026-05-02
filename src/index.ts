import "./config/env.config";

import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { clerkMiddleware } from "@clerk/express";

import uploadRouter from "./routes/uploadImage.route";
import { apiPerformanceLogger } from "./common/functions/checkAPIPerformance.function";
import authRouter from "./routes/auth.route";
import groupRouter from "./routes/group.route";

const app = express();

/* -------------------- Middleware -------------------- */
app.use(
  clerkMiddleware(),
  cors({
    origin: process.env.frontEndConnectionString,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length"],
    maxAge: 86400,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiPerformanceLogger);

/* -------------------- Routes -------------------- */
app.use("/upload", uploadRouter);
app.use("/auth", authRouter);
app.use("/group", groupRouter);

// //demo route for auth
// app.get("/protected", async (req, res) => {
//   //console.log(getAuth(req));
//   const { userId } = getAuth(req);
//   console.log("Authenticated user ID:", userId);
//   const user = await clerkClient.users.getUser(userId!);

//   //console.log(user);
//   //console.log("Authenticated user ID:", req);
//   if (!userId) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
//   res.json({ message: "You are authenticated!", userId });
// });

/* -------------------- DB Connection -------------------- */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.DBConnectionString as string);
  isConnected = true;

  console.log("MongoDB connected");
};

/* -------------------- Vercel Handler -------------------- */
export default async function handler(req: Request, res: Response) {
  await connectDB();
  return app(req, res);
}

/* -------------------- Local Server -------------------- */
const PORT = process.env.PORT || 4000;

if (process.env.VERCEL !== "1") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
