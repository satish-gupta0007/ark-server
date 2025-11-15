import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addSubCatgeory, getSubcategoryById, updategSubCategry } from "../controllers/subcategoryController.js";

const subCatgeoryRouter = express.Router();
subCatgeoryRouter.post("/add",isAuthenticated,addSubCatgeory);
subCatgeoryRouter.get("/get/:id",isAuthenticated,getSubcategoryById);
subCatgeoryRouter.put("/update/:id",isAuthenticated,updategSubCategry);

export default subCatgeoryRouter;
