import { uploadImage } from "../controller/image-controller/uploadImage.controller";
import { Router } from "express";
import { requireAuth } from "../middleware/authetication.middleware";
const uploadRouter = Router();

uploadRouter.post("/uploadImage", requireAuth, uploadImage); //Upload Image Route

export default uploadRouter;
