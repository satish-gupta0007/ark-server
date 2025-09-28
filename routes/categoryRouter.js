import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addCatgeory, getActiveCategoryList, getAllCategoryList, getCategoryBasedOnId, getCategoryList, updategCategry } from "../controllers/categoryController.js";

const categoryRouter = express.Router();
categoryRouter.post("/add", addCatgeory);
categoryRouter.get("/get-all", getAllCategoryList);
categoryRouter.put("/update/:id",updategCategry);
categoryRouter.get("/get-list",getCategoryList);
categoryRouter.get("/get-active-list",getActiveCategoryList);
categoryRouter.get("/get/:id",getCategoryBasedOnId);


export default categoryRouter;
