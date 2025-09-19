import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Category } from "../models/categoryModel.js";


export const addSubCatgeory = catchAsyncError(async (req, res, next) => {
    try {
        const { name, isActive, parentId, categoryImage, level } = req.body;
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return next(new ErrorHandler("Category name is already exist.", 400));
        }

        const categoryData = { name, isActive, parentId, categoryImage, level };
        const category = await Category.create(categoryData);
        const result = await category.save();
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});


export const getSubcategoryById = catchAsyncError(async (req, res, next) => {
    try {
        const result = await Category.find({ isActive: true });
        res.status(200).json({ data: result });
    } catch (error) {
        next(error);
    }
});

export const updategSubCategry = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params; // userId from route
        const { name, isActive, categoryImage } = req.body;

        let category = await Category.findById(id);
        if (!category) {
            return next(new ErrorHandler("Category not found", 404));
        }

        if (name !== undefined) category.name = name;
        if (isActive !== undefined) category.isActive = isActive;
        if (categoryImage !== undefined) category.categoryImage = categoryImage;

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        next(error);
    }
});