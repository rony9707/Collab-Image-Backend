import { devLogger } from "@utils/logger.util";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to measure and log the performance (execution time) of each API request.
 * Logs the HTTP method, URL, and time taken in milliseconds.
 */
export function apiPerformanceLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;

    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: `${durationMs.toFixed(2)} ms`
    };

    devLogger("[PERF]", logData);
  });

  next();
}

/**
 * Example usage:
 * import { apiPerformanceLogger } from "@common/common.class";
 * app.use(apiPerformanceLogger);
 */
