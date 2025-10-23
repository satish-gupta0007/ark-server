import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getCollegeListExcel, uploadCollegeList } from "../controllers/fileupload.js";
import multer from "multer";
import path from 'path';
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });

// const upload = multer({ storage });
// Auto-create uploads folder
const uploadDir = path.join(process.cwd(), 'uploads');
import fs from 'fs';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });
const settingrouter = express.Router();
//user
settingrouter.post("/add-college-list",  upload.single("file"),uploadCollegeList);
settingrouter.get("/get-college-list-excel", getCollegeListExcel);






export default settingrouter;
