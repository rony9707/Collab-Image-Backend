// src/config/env.config.ts

import dotenv from "dotenv";
import { Environment } from "../common/enums/environment.enum";

const env =
  (process.env.NODE_ENV as Environment) || Environment.Development;

// Only load dotenv locally (NOT on Vercel)
if (process.env.VERCEL !== "1") {
  dotenv.config({
    path:
      env === Environment.Production
        ? ".env.production"
        : ".env.development",
  });

  console.log("Loaded local env file");
} else {
  console.log("Using Vercel environment variables");
}
