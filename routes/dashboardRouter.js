import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getDashboardData } from "../controllers/dashboardController.js";


const dashboardRouter = express.Router();
dashboardRouter.get("/counts",isAuthenticated,getDashboardData);

export default dashboardRouter;
