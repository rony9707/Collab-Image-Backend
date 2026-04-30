import runApiPrechecks from "../../common/functions/common.functions";
import { globalConfig } from "../../config/global.config";
import { imagekit } from "../../config/imagekit.config";
import { devLogger } from "../../utils/logger.util";
import { Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";


const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImage = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      //Run API Prechecks
      const precheckResult = runApiPrechecks({
        request: req,
        response: res,
        APIKeyCheck: globalConfig.enableImageUploadAPI,
      });
      if (!precheckResult) return;

      //Run API Data Checks
      if (!checkAPIData(req, res)) {
        return;
      }

      const { username, usergroup } = req.body;

      // Upload to ImageKit
      const response = await uploadImageToImageKit(
        req.file.buffer,
        username,
        usergroup,
      );
      devLogger("Upload Success:", response);

      res.status(200).json({
        success: true,
        message: "File uploaded successfully"
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

function checkAPIData(
  req: Request,
  res: Response,
): req is Request & { file: Express.Multer.File } {
  const { username, usergroup } = req.body;

  if (!username || !usergroup) {
    res.status(400).json({
      success: false,
      message: "Both username and usergroup are required",
    });
    return false;
  }

  if (!req.file) {
    res.status(400).json({
      success: false,
      message: "No file to be present to be uploaded",
    });
    return false;
  }

  return true;
}

async function uploadImageToImageKit(
  fileBuffer: Buffer,
  username: string,
  usergroup: string,
) {
  const folderPath = `CameraCollab/${username}/${usergroup}`;
  const fileName = `${uuidv4()}`;
  const response = await imagekit.upload({
    file: fileBuffer,
    fileName: `${username}_${usergroup}_${fileName}`,
    folder: folderPath,
  });
  return response;
}
