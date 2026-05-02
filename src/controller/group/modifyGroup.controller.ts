import { devLogger } from "../../utils/logger.util";
import { Group } from "../../models/group.model";
import { Request, Response } from "express";
import runApiPrechecks from "../../common/functions/common.functions";
import { globalConfig } from "../../config/global.config";

export const modifyGroup = async (req: Request, res: Response) => {
  try {
    // Run API Prechecks
    const precheckResult = runApiPrechecks({
      request: req,
      response: res,
      APIKeyCheck: globalConfig.enableModifyGroupAPI,
    });
    if (!precheckResult) return;

    const { userId } = (req as any).user;

    const groupId = req.params.groupId as string;
    const email = req.params.email as string;
    const action = req.params.action as string; // add | remove

    //Run API Data Checks
    if (!(await checkAPIData(res, groupId, email, action))) {
      return;
    }

    // Find group
    const group = await Group.findById(groupId);

    if (!group) {
      devLogger("Modify Group Failed: Group not found");
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    // Only creator can modify
    if (group?.createdBy?.userId !== userId) {
      devLogger("Modify Group Failed: Unauthorized");
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this group",
      });
    }

    // Prevent removing creator
    if (action === "remove" && email === group?.createdBy?.email) {
      devLogger("Modify Group Failed: Cannot remove creator");
      return res.status(400).json({
        success: false,
        message: "Creator cannot be removed from the group",
      });
    }

    let message = "";

    if (action === "add") {
      if (group.access.includes(email)) {
        devLogger("Modify Group: Email already exists");
        return res.status(400).json({
          success: false,
          message: "Email already has access",
        });
      }

      group.access.push(email);
      message = "Email added to group";
      devLogger(`Email added: ${email}`);
    }

    if (action === "remove") {
      if (!group.access.includes(email)) {
        devLogger("Modify Group: Email not found in group");
        return res.status(400).json({
          success: false,
          message: "Email not found in group",
        });
      }

      group.access = group.access.filter((e: string) => e !== email);
      message = "Email removed from group";
      devLogger(`Email removed: ${email}`);
    }

    await group.save();

    return res.status(200).json({
      success: true,
      message,
      group,
    });
  } catch (error: any) {
    devLogger("Modify Group Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

async function checkAPIData(
  res: Response,
  groupId: string,
  email: string,
  action: string,
): Promise<boolean> {
  if (!groupId) {
    devLogger("Modify Group Failed: groupId is required");
    res.status(400).json({ success: false, message: "Group ID is required" });
    return false;
  }

  if (!email) {
    devLogger("Modify Group Failed: email is required");
    res.status(400).json({ success: false, message: "Email is required" });
    return false;
  }

  if (!["add", "remove"].includes(action)) {
    devLogger("Modify Group Failed: Invalid action");
    res.status(400).json({
      success: false,
      message: "Action must be either 'add' or 'remove'",
    });
    return false;
  }
  return true;
}
