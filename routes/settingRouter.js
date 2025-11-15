import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  getCollegeListExcel,
  getCollegeListJson,
  uploadCollegeList,
} from "../controllers/fileupload.js";


const isGCP = process.env.GOOGLE_CLOUD_PROJECT || process.env.K_SERVICE;

const uploadDir = isGCP
  ? "/tmp/uploads"
  : path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });
const settingrouter = express.Router();

settingrouter.post("/add-college-list",  isAuthenticated,upload.single("file"), uploadCollegeList);
settingrouter.get("/get-college-list-excel", isAuthenticated, getCollegeListExcel);
settingrouter.get("/get-college-list", getCollegeListJson);

export default settingrouter;

