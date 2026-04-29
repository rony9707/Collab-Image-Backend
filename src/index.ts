import "@config/env.config";

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Environment } from "@common/enums/environment.enum";
import uploadRouter from "@routes/uploadImage.route";
import { apiPerformanceLogger } from "@common/class/checkAPIPerformance.class";

const app = express();
// Create HTTP server using Express
const server = http.createServer(app);

// Enable CORS with specific settings
app.use(
  cors({
    origin: process.env.frontEndConnectionString,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length"],
    maxAge: 86400,
  }),
);

// Parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiPerformanceLogger);

// Register upload routes
app.use("/upload", uploadRouter);

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.DBConnectionString as string)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server on specified port
    server.listen(process.env.PORT, () => {
      if (process.env.ENV == Environment.Production) {
        console.log(`Server running on ${process.env.ENV} environment`);
      } else {
        console.log(
          `Server running on port ${process.env.PORT} in ${process.env.ENV} mode`,
        );
      }
    });
  })
  .catch((err) => {
    console.error("DB Connection failed:", err);
  });
