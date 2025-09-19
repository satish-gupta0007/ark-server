import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addSubCatgeory, getSubcategoryById, updategSubCategry } from "../controllers/subcategoryController.js";

const subCatgeoryRouter = express.Router();
subCatgeoryRouter.post("/add",addSubCatgeory);
subCatgeoryRouter.get("/get/:id",getSubcategoryById);
subCatgeoryRouter.put("/update/:id",updategSubCategry);

export default subCatgeoryRouter;
