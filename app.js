import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
// import userRouter from "./routes/userRouter.js";
// import { removeUnverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
import categoryRouter from "./routes/categoryRouter.js";
// import s3imagerouter from "./routes/s3ImageRouter.js";
import subCatgeoryRouter from "./routes/subCategoryRouter.js";
// import settingrouter from "./routes/settingRouter.js";
// import abvpRouter from "./routes/abvpRouter.js";
import helmet from 'helmet'
import productsRouter from "./routes/productsRouter.js";
// import dashboardRouter from "./routes/dashboardRouter.js";
// import OpenAI from 'openai'
// import notificationRouter from "./routes/notificationRouter.js";
// import orderRouter from "./routes/orderRouter.js";

export const app = express();

config({ path: "./config.env" });

// CORS for specific origins
const allowedOrigins = ['http://localhost:4200', 'http://localhost:4201',
  'http://localhost:5173', 'http://localhost:4400',
  'http://localhost:4100', 'http://localhost:8100',
  'https://ark-server-6lv5.onrender.com',
  "http://localhost:4400", "http://localhost:4300"];

app.use(cors({
  origin: [
    allowedOrigins
  ],
  // credentials: true
}));

// app.use(helmet());
app.use(cookieParser());
app.use(express.json());
console.log('application running', process.env.PORT)
app.use(express.urlencoded({ extended: true }));
app.get('/', async (req, res) => {
  try {
    res.send("Hello from server");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});
// app.use("/api/v1/dashboard", dashboardRouter);
// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/s3-image", s3imagerouter);
// app.use("/api/v1/category", categoryRouter);
// app.use("/api/v1/sub-category", subCatgeoryRouter);
// app.use("/api/v1/settings", settingrouter);
// app.use("/api/v1/abvp", abvpRouter);
// app.use("/api/v1/notification", notificationRouter);

//ecommerce

// app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/sub-category", subCatgeoryRouter);
app.use("/api/v1/products",productsRouter );







connection();

app.use(errorMiddleware);

