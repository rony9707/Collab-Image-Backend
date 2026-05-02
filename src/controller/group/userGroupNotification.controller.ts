import { Request, Response } from "express";
import { User } from "../../models/user.model";

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notifications = user.invitedGroups.sort(
      (a: any, b: any) =>
        new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime()
    );

    const unreadCount = notifications.filter((n: any) => !n.isSeen).length;

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};