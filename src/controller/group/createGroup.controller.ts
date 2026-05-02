import { devLogger } from "../../utils/logger.util";
import { groupConfig } from "../../config/group.config";
import { Group } from "../../models/group.model";
import { Request, Response } from "express";
import runApiPrechecks from "../../common/functions/common.functions";
import { globalConfig } from "../../config/global.config";

export const createGroup = async (req: Request, res: Response) => {
  try {
    //Run API Prechecks
    const precheckResult = runApiPrechecks({
      request: req,
      response: res,
      APIKeyCheck: globalConfig.enableCreateGroupAPI,
    });
    if (!precheckResult) return;

    const { userId, user } = (req as any).user;

    const email = user.emailAddresses[0]?.emailAddress;
    const name = req.params.name as string;

    //Run API Data Checks
    if (!(await checkAPIData(res, name, userId, email))) {
      return;
    }

    // Create group
    const group = await Group.create({
      name,
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
  userId: string,
  email: string,
): Promise<boolean> {
  if (!name) {
    res.status(400).json({
      success: false,
      message: "Group name is required",
    });
    devLogger("Group Creation Failed: Group name is required");
    return false;
  }

  //No spaces allowed anywhere
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

  // Max 10 groups per user
  const groupCount = await Group.countDocuments({
    "createdBy.userId": userId,
  });

  if (groupCount >= groupConfig.maxGroupSizePerUser) {
    res.status(400).json({
      success: false,
      message: `You can create a maximum of ${groupConfig.maxGroupSizePerUser} groups only`,
    });
    devLogger(
      `Group Creation Failed: User has already created maximum number of groups (${groupConfig.maxGroupSizePerUser})`,
    );
    return false;
  }

  return true;
}
