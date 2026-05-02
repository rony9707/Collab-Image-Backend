import runApiPrechecks from "../../common/functions/common.functions";
import { User } from "../../models/user.model";
import { Request, Response } from "express";
import { globalConfig } from "../../config/global.config";

export const userSearch = async (req: Request, res: Response) => {
  try {
    //Run API Prechecks
    const precheckResult = runApiPrechecks({
      request: req,
      response: res,
      APIKeyCheck: globalConfig.enableUserSearchAPI,
    });
    if (!precheckResult) return;

    const search = (req.query.email as string)?.trim();

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search text is required",
      });
    }

    // Find emails starting with search text (case-insensitive)
    const users = await User.find({
      email: { $regex: `^${search}`, $options: "i" },
    })
      .select("email -_id") // only return email
      .limit(10); // limit for performance

    // Extract only email list
    const emailList = users.map((u) => u.email);

    return res.status(200).json({
      success: true,
      emails: emailList,
    });
  } catch (error) {
    console.error("User Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
