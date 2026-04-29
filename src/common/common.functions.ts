import { devLogger } from "@utils/logger.util";
import { Response } from "express";

// Function to run before running API logic, to check for API key or other preconditions
export default function runApiPrechecks({
  response,
  APIKeyCheck: APIKeyCheck,
}: {
  response: Response;
  APIKeyCheck: boolean;
}) {
  if (!APIKeyCheck) {
    devLogger("Image Upload API is disabled in global config");
    response.status(503).json({
      message: "Image Uploads are temporarily disabled",
    });
    return false;
  }
  return true;
}
