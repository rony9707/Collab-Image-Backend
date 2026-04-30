// src/config/env.ts
import dotenv from "dotenv";
import { Environment } from "@common/enums/environment.enum";

const env = (process.env.NODE_ENV as Environment) || Environment.Development;

dotenv.config({
  path: env === Environment.Production ? ".env.production" : ".env.development",
});
