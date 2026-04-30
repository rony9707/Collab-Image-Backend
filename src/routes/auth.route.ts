import { authenticate } from "../controller/user/authenticate.controller";
import { Router } from "express";
import { requireAuth } from "../middleware/authetication.middleware";
const authRouter = Router();

authRouter.get("/login", requireAuth, authenticate); //authenticate user and create user in DB if not present

export default authRouter;
