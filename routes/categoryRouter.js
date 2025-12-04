import express from "express";
import { addCategory, deleteCategory, getAllActiveCategoryList,
     getAllCategoryList, updateCategory } 
     from "../controllers/categoryController.js";

const categoryRouter = express.Router();
categoryRouter.post("/add", addCategory);
categoryRouter.get("/getAll", getAllCategoryList);
categoryRouter.put("/update/:categoryId",updateCategory);
categoryRouter.delete("/delete/:id",deleteCategory);
categoryRouter.get("/get-active-category",getAllActiveCategoryList);

export default categoryRouter;
