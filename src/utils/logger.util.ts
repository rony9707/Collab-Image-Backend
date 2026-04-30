// src/utils/logger.ts

import { globalConfig } from "../config/global.config";

export const devLogger = (...args: unknown[]) => {
  if (globalConfig.debugMode) {
    const err = new Error();

    // Remove this function from stack trace
    Error.captureStackTrace(err, devLogger);

    const stack = err.stack?.split("\n");

    // Usually the 2nd or 3rd line contains caller info
    const callerLine = stack && stack.length > 1 ? stack[1].trim() : "Unknown caller";

    console.log(`[LOG FROM]: ${callerLine}`);
    console.log(...args);
  }
};