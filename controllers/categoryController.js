import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Category } from "../models/categoryModel.js";

export const addCategory = catchAsyncError(async (req, res, next) => {
    try {
        console.log('req.body::', req.body)
        let toStoreCategoryInfo = {
            categoryName: req.body.categoryName,
            categoryImage: req.body.image,
            isActive: 1
        }
        const isExistData = await Category.find({ categoryName: req.body.categoryName });
        if (isExistData.length > 0) {
            res.status(400).json({ message: 'Category Name cannot be same' });
        } else {
            await Category.create(toStoreCategoryInfo);
            res.status(200).json({ message: 'success', statusCode: 200 });
        }
    } catch (error) {
        console.log('error::', error)
        res.status(500).json({ message: "An error occured" });
    }
});

export const getAllCategoryList = catchAsyncError(async (req, res, next) => {
    try {
        const isExistData = await Category.find({ isDeleted: 0 });
        console.log('isExistData::',isExistData)
        res.status(200).json({ message: 'success', data: isExistData });
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
});

export const getAllActiveCategoryList = catchAsyncError(async (req, res, next) => {
    try {
        const isExistData = await Category.find({ isDeleted: 0,isActive:1 });
        res.status(200).json({ message: 'success', data: isExistData });
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
});

export const updateCategory = catchAsyncError(async (req, res, next) => {
    try {
        let toStoreCategoryInfo = {
          categoryName: req.body.categoryName,
          categoryImage: req.body.updateImage ? req.body.image : req.body.productImage,
          isActive: req.body.status ? 1 : 0
        }
        await Category.findOneAndUpdate({ _id: req.params.categoryId }, toStoreCategoryInfo, { upsert: true } )
          res.status(200).json({ message: 'update successful!', statusCode: 200 })
    } catch (error) {
        console.log('error::', error)
        res.status(500).json({ message: "An error occured" });
    }
});

export const deleteCategory = catchAsyncError(async (req, res, next) => {
    try {
        let toStoreCategoryInfo = {
          categoryName: req.body.categoryName,
          categoryImage: req.body.updateImage ? req.body.image : req.body.productImage,
          isActive: req.body.status ? 1 : 0
        }
        await Category.findOneAndUpdate({ _id: req.params.categoryId }, toStoreCategoryInfo, { upsert: true } )
          res.status(200).json({ message: 'update successful!', statusCode: 200 })
    } catch (error) {
        console.log('error::', error)
        res.status(500).json({ message: "An error occured" });
    }
});