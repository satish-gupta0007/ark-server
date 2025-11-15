import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import formidable from 'formidable';
import fs from 'fs';
import AWS from 'aws-sdk';
import { config } from "dotenv";
import sharp from "sharp";
config({ path: "./config.env" });
import path from "path";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  region: process.env.AWS_REGION,
});


const s3 = new AWS.S3();

export const addImageS3 = catchAsyncError(async (req, res, next) => {
  try {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).send("Error parsing form data");
      }
      const file = files.image?.[0] || files.image; 
      if (!file) {
        return res.status(400).send("No file uploaded");
      }

      const filePath = file.filepath || file.path;
      if (!filePath) {
        return res.status(500).send("File path missing");
      }
      const inputBuffer = fs.readFileSync(filePath);
      const webpBuffer = await sharp(inputBuffer)
        .webp({ quality: 90 })
        .toBuffer();

      const folder = (req.query.imageContent || "uploads") + "/";
      const newFileName =
        (file.originalFilename || "image").replace(/\.[^.]+$/, "") + ".webp";

      const params = {
        Bucket: process.env.AWS_Bucket,
        Key: folder + newFileName,
        Body: webpBuffer,
        ContentType: "image/webp",
      };

      const data = await s3.upload(params).promise();
      fs.unlink(filePath, (cleanupErr) => {
        if (cleanupErr) console.warn("Failed to remove temp file:", cleanupErr);
      });

      res.json({
        message: "File uploaded successfully as WebP",
        url: data.Location,
      });
    });
  } catch (error) {
    next(error);
  }
});

export const deleteImageS3 = catchAsyncError(async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl || !process.env.AWS_Bucket) throw new Error("Image URL and bucket name are required");
    const urlParts = imageUrl.split('.com/');
    if (urlParts.length < 2) throw new Error("Invalid S3 URL");
    const objectKey = urlParts[1];
    const params = {
      Bucket: process.env.AWS_Bucket,
      Key: objectKey
    };
    await s3.deleteObject(params).promise();
    res.json({
      message: "Image deleted Successful!",
    });
  } catch (error) {
    next(error);
  }
});

export const addMultipleImageS3 = catchAsyncError(async (req, res, next) => {
  try {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Error parsing form data" });
      }

      let fileArray = [];
      if (Array.isArray(files.images)) fileArray = files.images;
      else if (files.images) fileArray = [files.images];

      if (fileArray.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      const uploadedFiles = [];

      for (const file of fileArray) {

        const filePath = file.filepath || file.path;
        if (!filePath) continue;

        try {
          const inputBuffer = fs.readFileSync(filePath);
          const webpBuffer = await sharp(inputBuffer)
            .webp({ quality: 90 })
            .toBuffer();
          const folder = (req.query.imageContent || "uploads") + "/";
          const baseName = path
            .basename(file.originalFilename || "image", path.extname(file.originalFilename || ""))
            .replace(/\s+/g, "_");
          const newFileName = `${baseName}-${Date.now()}.webp`;

          const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: folder + newFileName,
            Body: webpBuffer,
            ContentType: "image/webp",
          };

          const { Location } = await s3.upload(params).promise();
          uploadedFiles.push({
            original: file.originalFilename,
            s3Url: Location,
          });

          fs.unlink(filePath);
        } catch (uploadErr) {
          console.error("Error uploading to S3:");
        }
      }

      return res.json({
        message: "Upload complete",
        files: uploadedFiles,
      });
    });
  }
  catch (error) {
    next(error);
  }
});
