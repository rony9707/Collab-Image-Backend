import { Request, Response } from "express";
import { User } from "../../models/user.model";
import { Group } from "../../models/group.model";

export const respondToInvite = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const groupId = req.params.groupId;
    const action = req.params.action; // accept | reject

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const invite = user.invitedGroups.find(
      (g: any) => g.groupId.toString() === groupId
    );

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "Invite not found",
      });
    }

    if (invite.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Already handled",
      });
    }

    if (action === "accept") {
      invite.status = "accepted";

      await Group.findByIdAndUpdate(groupId, {
        $addToSet: { access: user.email },
      });
    }

    if (action === "reject") {
      invite.status = "rejected";
    }

    invite.isSeen = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Invite ${action}ed`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};