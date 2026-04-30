import { Request, Response } from "express";
import { Group } from "../../models/group.model";
import mongoose from "mongoose";
import { devLogger } from "../../utils/logger.util";
import runApiPrechecks from "../../common/functions/common.functions";
import { globalConfig } from "../../config/global.config";

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    //Run API Prechecks
    const precheckResult = runApiPrechecks({
      request: req,
      response: res,
      APIKeyCheck: globalConfig.enableDeleteGroupAPI,
    });
    if (!precheckResult) return;

    const { userId } = (req as any).user;
    const { groupId } = req.params as { groupId: string };

    // Validate Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      devLogger("Delete Group Failed: Invalid group ID");
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
      });
    }

    // Find group
    const group = await Group.findById(groupId);

    if (!group) {
      devLogger("Delete Group Failed: Group not found");
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Only creator can delete
    if (group?.createdBy?.userId !== userId) {
      devLogger("Delete Group Failed: User is not the creator of the group");
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this group",
      });
    }

    await Group.findByIdAndDelete(groupId);

    devLogger("Group deleted successfully");

    return res.json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    devLogger("Delete Group Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
