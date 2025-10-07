import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addCatgeory, deleteCategory, getActiveCategoryList, getAllCategoryList, getCategoryBasedOnId, getCategoryList, updategCategry } from "../controllers/categoryController.js";

const categoryRouter = express.Router();
categoryRouter.post("/add",isAuthenticated, addCatgeory);
categoryRouter.get("/get-all",isAuthenticated, getAllCategoryList);
categoryRouter.put("/update/:id",isAuthenticated,updategCategry);
categoryRouter.get("/get-list",isAuthenticated,getCategoryList);
categoryRouter.get("/get-active-list",isAuthenticated,getActiveCategoryList);
categoryRouter.get("/get/:id",isAuthenticated,getCategoryBasedOnId);
categoryRouter.delete("/delete/:id",isAuthenticated,deleteCategory);



export default categoryRouter;
