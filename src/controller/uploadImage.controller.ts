import runApiPrechecks from "@common/common.functions";
import { globalConfig } from "@config/global.config";
import { devLogger } from "@utils/logger.util";
import { Request, Response, ErrorRequestHandler } from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImage = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      //Run API Prechecks
      const precheckResult = runApiPrechecks({
        response: res,
        APIKeyCheck: globalConfig.enableImageUploadAPI,
      });
      if (!precheckResult) return;

      devLogger("FILE:", req.file); // metadata
      devLogger("BODY:", req.body); // text fields

      if (req.file) {
        devLogger("Buffer length:", req.file.buffer.length); // actual file data
      }

      res.status(200).json({
        success: true,
        message: "File received (not saved)",
      });
    } catch (error: unknown) {
      let message = "Unknown error";

      if (error instanceof Error) {
        message = error.message;
      }

      res.status(500).json({
        success: false,
        message: "Failed",
        error: message,
      });
    }
  },
];
