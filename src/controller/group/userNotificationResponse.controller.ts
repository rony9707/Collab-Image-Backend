import { Request, Response } from "express";
import { User } from "../../models/user.model";
import { Group } from "../../models/group.model";

export const respondToInvite = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const { groupId, action } = req.params;

    // Validate action
    if (!["accept", "reject"].includes(action as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'accept' or 'reject'",
      });
    }

    // Find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Find ONLY pending invite
    const invite = user.invitedGroups.find(
      (g: any) => g.groupId.toString() === groupId && g.status === "pending",
    );

    if (!invite) {
      return res.status(400).json({
        success: false,
        message: "No pending invite found or already handled",
      });
    }

    // Check if group exists
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Handle actions
    if (action === "accept") {
      invite.status = "accepted";

      // Add user email to group access (avoid duplicates)
      await Group.findByIdAndUpdate(groupId, {
        $addToSet: { access: user.email },
      });
    }

    if (action === "reject") {
      invite.status = "rejected";
    }

    //Mark as seen
    invite.isSeen = true;

    //Clean duplicate invites (keep only latest)
    user.invitedGroups.forEach((g: any) => {
      if (
        g.groupId.toString() === groupId &&
        g._id.toString() !== invite._id.toString()
      ) {
        user.invitedGroups.pull(g._id);
      }
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Invite ${action}ed successfully`,
    });
  } catch (error) {
    console.error("RespondToInvite Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
