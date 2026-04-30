import { Request, Response } from "express";
import { Group } from "../../models/group.model";
import { devLogger } from "../../utils/logger.util";
import runApiPrechecks from "../../common/functions/common.functions";
import { globalConfig } from "../../config/global.config";

export const getGroups = async (req: Request, res: Response) => {
  try {
    //Run API Prechecks
    const precheckResult = runApiPrechecks({
      request: req,
      response: res,
      APIKeyCheck: globalConfig.enableGetGroupsAPI,
    });
    if (!precheckResult) return;

    const email = req.params.email as string;

    if (!email) {
      devLogger("Get Groups Failed: User email is required");
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const groups = await Group.find({
      $or: [
        { "createdBy.email": email }, // creator
        { access: email }, // in access array
      ],
    }).sort({ createdAt: -1 }); // latest first

    devLogger(`Found ${groups.length} groups for email: ${email}`);

    return res.json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    devLogger("Get Groups Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
