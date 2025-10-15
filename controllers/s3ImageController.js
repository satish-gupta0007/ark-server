import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import formidable from 'formidable';
import fs from 'fs';
import AWS from 'aws-sdk';
import { config } from "dotenv";
import sharp from "sharp";
import multer from "multer";
config({ path: "./config.env" });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey:process.env.AWS_SECRETACCESSKEY,
  region: process.env.AWS_REGION, 
});


const s3 = new AWS.S3();
// ------------------ ADD Image To S3 ------------------
// export const addImageS3 = catchAsyncError(async (req, res, next) => {
//     try {
//         // const form = new formidable.IncomingForm({ multiples: true });
//         const form = formidable({ multiples: true }); // Pass options directly to the function

//         form.parse(req, async (err, fields, files) => {
//             if (err) {
//                 console.error("Form parsing error:", err);
//                 return res.status(500).send("Error parsing form data");
//             }
//             const file = files.image;
//             if (!file) {
//                 return res.status(400).send("No file uploaded");
//             }
//             const filePath = file[0].filepath || file.path[0];
//             if (!filePath) {
//                 return res.status(500).send("File path missing");
//             }
//             // Read the file as a buffer
//             const fileStream = fs.createReadStream(filePath);
//             const folder = req.query.imageContent + "/";
//             console.log('req.file::',req.file)
// const { originalname, buffer } = req.file;

//     // Convert to WebP and preserve transparency
//     const webpBuffer = await sharp(buffer)
//       .webp({ quality: 90 }) // you can tweak quality (0–100)
//       .toBuffer();

//     const newFileName = originalname.replace(/\.[^.]+$/, "") + ".webp";

//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: folder + file[0].originalFilename,
//       Body: webpBuffer,
//       ContentType: "image/webp",
//       ACL: "public-read",
//     };
//             // const params = {
//             //     Bucket: process.env.AWS_Bucket,
//             //     Key: folder + file[0].originalFilename,
//             //     Body: fileStream,
//             //     ContentType: file[0].mimetype,
//             //     // ACL: "public-read",
//             // };

//             // s3.upload(params, (err, data) => {
//             //     if (err) {
//             //         console.error("S3 Upload Error:", err);
//             //         return res.status(500).send("Failed to upload to S3");
//             //     }
//             //     res.send({
//             //         message: "File uploaded successfully",
//             //         url: data.Location,
//             //     });
//             // });
//              const data = await s3.upload(params).promise();

//     res.send({
//       message: "File uploaded successfully as WebP",
//       url: data.Location,
//     });
//         });
//     } catch (error) {
//         next(error);
//     }
// });

export const addImageS3 = catchAsyncError(async (req, res, next) => {
  try {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res.status(500).send("Error parsing form data");
      }

      const file = files.image?.[0] || files.image; // handle both array or single file
      if (!file) {
        return res.status(400).send("No file uploaded");
      }

      const filePath = file.filepath || file.path;
      if (!filePath) {
        return res.status(500).send("File path missing");
      }

      // Read file from disk
      const inputBuffer = fs.readFileSync(filePath);

      // Convert to WebP and preserve transparency
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
        // ACL: "public-read",
      };

      // Upload to S3
      const data = await s3.upload(params).promise();

      // Clean up local file (optional)
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
