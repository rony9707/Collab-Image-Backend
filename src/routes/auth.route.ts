import { authenticate } from "../controller/user/authenticate.controller";
import { Router } from "express";
import { requireAuth } from "../middleware/authetication.middleware";
import { userSearch } from "../controller/user/usersearch.controller";
const authRouter = Router();

authRouter.get("/login", requireAuth, authenticate); //authenticate user and create user in DB if not present
authRouter.get("/usersearch", requireAuth, userSearch); //search for a user by email

export default authRouter;
