import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addAboutAbvp, addAbvpCollege, deleteAbvpCollege, getAboutAbvp, getAbvpColleges, updategAbvpCategoy } from "../controllers/abvpController.js";

const abvpRouter = express.Router();
abvpRouter.post("/add-what-is-abvp",isAuthenticated, addAboutAbvp);
abvpRouter.get("/get-what-is-abvp", isAuthenticated,getAboutAbvp);

//advp-college

abvpRouter.get("/get-colleges", isAuthenticated,getAbvpColleges);
abvpRouter.post("/add-college", isAuthenticated,addAbvpCollege);
abvpRouter.put("/update-college/:id", isAuthenticated,updategAbvpCategoy);
abvpRouter.delete("/delete-college/:id", isAuthenticated,deleteAbvpCollege);


export default abvpRouter;
