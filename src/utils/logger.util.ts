// src/utils/logger.ts

import { globalConfig } from "../config/global.config";


export const devLogger = (...args: unknown[]) => {
  if (globalConfig.debugMode) {
    console.log(...args);
  }
};