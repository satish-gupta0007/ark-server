import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addImageS3, addMultipleImageS3, deleteImageS3 } from "../controllers/s3ImageController.js";

const s3imagerouter = express.Router();
//user
s3imagerouter.post("/add",isAuthenticated, addImageS3);
s3imagerouter.post("/delete", isAuthenticated,deleteImageS3);

s3imagerouter.post("/add-multiple", isAuthenticated,addMultipleImageS3);






export default s3imagerouter;
