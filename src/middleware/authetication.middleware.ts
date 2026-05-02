import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await clerkClient.users.getUser(auth.userId!);

    // Attach user info to request (optional but useful)
    (req as any).user = {
      userId: auth.userId,
      sessionId: auth.sessionId,
      user: user,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
