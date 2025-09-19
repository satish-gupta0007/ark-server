import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
// import { removeUnverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
import categoryRouter from "./routes/categoryRouter.js";
import s3imagerouter from "./routes/s3ImageRouter.js";
import subCatgeoryRouter from "./routes/subCategoryRouter.js";

export const app = express();
config({ path: "./config.env" });

// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_PROD],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
// CORS for specific origins
const allowedOrigins = ['http://localhost:4200', 'http://localhost:4201','http://localhost:5173','http://localhost:4400','http://localhost:4100','http://localhost:8100'];
// app.use((req, res, next) => {
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', async (req, res) => {
  try {
    console.log("Request received");
    res.send("Hello from Vercel");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Something went wrong");
  }
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/s3-image", s3imagerouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/sub-category", subCatgeoryRouter);





// removeUnverifiedAccounts();
connection();

app.use(errorMiddleware);
