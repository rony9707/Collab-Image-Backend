import { devLogger } from "../../utils/logger.util";
import { groupConfig } from "../../config/group.config";
import { Group } from "../../models/group.model";
import { Request, Response } from "express";
import runApiPrechecks from "../../common/functions/common.functions";
import { globalConfig } from "../../config/global.config";

export const createGroup = async (req: Request, res: Response) => {
  try {
    // Run API Prechecks
    const precheckResult = runApiPrechecks({
      request: req,
      response: res,
      APIKeyCheck: globalConfig.enableCreateGroupAPI,
    });
    if (!precheckResult) return;

    const { userId, user } = (req as any).user;

    const email = user.emailAddresses[0]?.emailAddress;

    //Get from BODY instead of params
    const { name, description } = req.body;

    // Run API Data Checks
    if (!(await checkAPIData(res, name, description, userId, email))) {
      return;
    }

    //Create group with description
    const group = await Group.create({
      name,
      description: description || "", // optional
      createdBy: {
        userId,
        email,
      },
      access: [email],
      createdAt: new Date(),
    });

    devLogger("Group created successfully");

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group,
    });
  } catch (error: any) {
    devLogger("Create Group Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

async function checkAPIData(
  res: Response,
  name: string,
  description: string,
  userId: string,
  email: string,
): Promise<boolean> {
  if (!name || !description) {
    res.status(400).json({
      success: false,
      message: "Group name and description are required",
    });
    devLogger("Group Creation Failed: Group name and description are required");
    return false;
  }

  // No spaces allowed
  if (/\s/.test(name)) {
    devLogger("Group Creation Failed: Group name should not contain spaces");
    res.status(400).json({
      success: false,
      message: "Group name should not contain spaces",
    });
    return false;
  }

  if (!email) {
    res.status(400).json({
      success: false,
      message: "User email is required",
    });
    devLogger("Group Creation Failed: User email is required");
    return false;
  }

  // Max groups per user
  const groupCount = await Group.countDocuments({
    "createdBy.userId": userId,
  });

  if (groupCount >= groupConfig.maxGroupSizePerUser) {
    res.status(400).json({
      success: false,
      message: `You can create a maximum of ${groupConfig.maxGroupSizePerUser} groups only`,
    });
    devLogger(
      `Group Creation Failed: Max groups reached (${groupConfig.maxGroupSizePerUser})`,
    );
    return false;
  }

  return true;
}