import { uploadImage } from "@controller/image/uploadImage.controller";
import { Router } from "express";
const uploadRouter = Router();


uploadRouter.post("/uploadImage", uploadImage); //Upload Image Route

export default uploadRouter;
