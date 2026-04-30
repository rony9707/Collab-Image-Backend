import { User } from "../../models/user.model";
import { Request, Response } from "express";

export const authenticate = async (req: Request, res: Response) => {
  try {
    const { userId, user } = (req as any).user;
    const email = user.emailAddresses[0]?.emailAddress;
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const name = `${firstName} ${lastName}`.trim();

    let isUserPresent = await User.findOne({ clerkId: userId });

    if (!isUserPresent) {
      isUserPresent = await User.create({
        clerkId: userId,
        email,
        name,
        createdDate: new Date(),
        lastLogin: new Date(),
      });
    } else {
      isUserPresent.lastLogin = new Date();
      await isUserPresent.save();
    }

    return res.json({
      message: "You are authenticated!",
      authenticated: true
    });
  } catch (error) {
    console.error("Authenticate Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
