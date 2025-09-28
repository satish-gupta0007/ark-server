import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import formidable from 'formidable';
import fs from 'fs';
import AWS from 'aws-sdk';
import { config } from "dotenv";
config({ path: "./config.env" });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey:process.env.AWS_SECRETACCESSKEY,
  region: process.env.AWS_REGION, 
});


const s3 = new AWS.S3();
// ------------------ ADD Image To S3 ------------------
export const addImageS3 = catchAsyncError(async (req, res, next) => {
    try {
        // const form = new formidable.IncomingForm({ multiples: true });
        const form = formidable({ multiples: true }); // Pass options directly to the function

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error("Form parsing error:", err);
                return res.status(500).send("Error parsing form data");
            }
            const file = files.image;
            if (!file) {
                return res.status(400).send("No file uploaded");
            }
            const filePath = file[0].filepath || file.path[0];
            if (!filePath) {
                return res.status(500).send("File path missing");
            }
            // Read the file as a buffer
            const fileStream = fs.createReadStream(filePath);
            const folder = req.query.imageContent + "/";

            const params = {
                Bucket: process.env.AWS_Bucket,
                Key: folder + file[0].originalFilename,
                Body: fileStream,
                ContentType: file[0].mimetype,
                ACL: "public-read",
            };

            s3.upload(params, (err, data) => {
                if (err) {
                    console.error("S3 Upload Error:", err);
                    return res.status(500).send("Failed to upload to S3");
                }
                res.send({
                    message: "File uploaded successfully",
                    url: data.Location,
                });
            });
        });
    } catch (error) {
        next(error);
    }
});

