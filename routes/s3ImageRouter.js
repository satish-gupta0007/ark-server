import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addImageS3 } from "../controllers/s3ImageController.js";

const s3imagerouter = express.Router();
//user
s3imagerouter.post("/add", addImageS3);





export default s3imagerouter;
