import { Request, Response } from "express";
import { Group } from "../../models/group.model";
import { devLogger } from "../../utils/logger.util";
import runApiPrechecks from "../../common/functions/common.functions";
import { globalConfig } from "../../config/global.config";
import { getPagination, getPaginationMeta } from "../../utils/pagenation.util";

export const getGroups = async (req: Request, res: Response) => {
  try {
    const precheckResult = runApiPrechecks({
      request: req,
      response: res,
      APIKeyCheck: globalConfig.enableGetGroupsAPI,
    });
    if (!precheckResult) return;

    const email = req.params.email as string;
    const type = (req.query.type as string) || "all"; // created | shared | all

    if (!email) {
      devLogger("Get Groups Failed: User email is required");
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { skip, perPage, currentPage } = getPagination({ page, limit });

    let filter: any = {};

    // Dynamic filter based on type
    if (type === "created") {
      filter = { "createdBy.email": email };
    } 
    else if (type === "shared") {
      filter = {
        access: email,
        "createdBy.email": { $ne: email }, // exclude own groups
      };
    } 
    else {
      // default: all
      filter = {
        $or: [
          { "createdBy.email": email },
          { access: email }
        ],
      };
    }

    // Count
    const total = await Group.countDocuments(filter);

    // Fetch
    const groups = await Group.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    const meta = getPaginationMeta({
      total,
      page: currentPage,
      limit: perPage,
    });

    devLogger(`Found ${groups.length} groups for email: ${email}, type: ${type}`);

    return res.json({
      success: true,
      type, 
      data: groups,
      meta,
    });

  } catch (error) {
    devLogger("Get Groups Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};