import { uploadImage } from "@controller/uploadImage.controller";
import { Router } from "express";
const uploadRouter = Router();


uploadRouter.post("/uploadImage", uploadImage); //Upload Image Route

export default uploadRouter;
