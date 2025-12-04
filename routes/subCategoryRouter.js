import express from "express";
// import { isAuthenticated } from "../middlewares/auth.js";
import { addSubCategory, deleteSubCategory, getAllSubcategoryCategoryList, getSubcategoryByCategoryId, updateSubCategory } from "../controllers/subcategoryController.js";

const subCatgeoryRouter = express.Router();
subCatgeoryRouter.post("/add",addSubCategory);
subCatgeoryRouter.get("/getAll", getAllSubcategoryCategoryList);
subCatgeoryRouter.put("/update/:subCategoryId",updateSubCategory);
subCatgeoryRouter.delete("/delete/:id",deleteSubCategory);

subCatgeoryRouter.get("/by-category/get/:categoryId", getSubcategoryByCategoryId);


// subCatgeoryRouter.get("/get/:id",isAuthenticated,getSubcategoryById);

export default subCatgeoryRouter;
 