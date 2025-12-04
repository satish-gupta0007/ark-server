import express from "express";
// import { isAuthenticated } from "../middlewares/auth.js";
// import { addSubCategory, deleteSubCategory, getAllSubcategoryCategoryList, updateSubCategory } from "../controllers/subcategoryController.js";
import { addProductDetails, addProductImages, getAllProductList, getProductDetails, getProductImages, updateProductDetails } from "../controllers/productController.js";

const productsRouter = express.Router();
productsRouter.post("/add-product-details",addProductDetails);
productsRouter.post("/update-product-details/:productId",updateProductDetails);

productsRouter.get("/get-product-images/:productId", getProductImages);

productsRouter.post("/add-product-images/:productId", addProductImages);

// productsRouter.get("/product-details/:productId", getProductDetails);


productsRouter.get("/get-product-list", getAllProductList);
productsRouter.get("/get-product-details/:productId", getProductDetails);


// productsRouter.put("/update/:subCategoryId",updateSubCategory);
// productsRouter.delete("/delete/:id",deleteSubCategory);

export default productsRouter;
 