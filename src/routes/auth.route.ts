import { authenticate } from "@controller/user/authenticate.controller";
import { Router } from "express";
import { requireAuth } from "../middleware/authetication.middleware";
const authRouter = Router();

authRouter.get("/login", requireAuth, authenticate); //Upload Image Route

export default authRouter;
