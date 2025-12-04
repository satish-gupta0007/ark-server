import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { SubCategory } from "../models/sucategoryModel.js";

export const addSubCategory = catchAsyncError(async (req, res, next) => {
    try {
        let toStoreCategoryInfo = {
            subCategoryName: req.body.subCategoryName,
            subCategoryImage: req.body.image,
            categoryId: req.body.categoryName,
            isActive: req.body.status ? 1 : 0
        }
        const isExistData = await SubCategory.find({ subCategoryName: req.body.subCategoryName,isDeleted:0 });
        if (isExistData.length > 0) {
            res.status(400).json({ message: 'SubCategory Name cannot be same' });
        } else {
            await SubCategory.create(toStoreCategoryInfo);
            res.status(200).json({ message: 'success', statusCode: 200 });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
});

export const getAllSubcategoryCategoryList = catchAsyncError(async (req, res, next) => {
    try {
       const isExistData =   await SubCategory.find({ isDeleted: 0 })
  .populate("categoryId", "categoryName")  // populate only categoryName field
  .lean();
        // const isExistData = await SubCategory.find({ isDeleted: 0 });
        res.status(200).json({ message: 'success', data: isExistData });
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
});

export const getAllActiveCategoryList = catchAsyncError(async (req, res, next) => {
    try {
        const isExistData = await SubCategory.find({ isDeleted: 0, isActive: 1 });
        res.status(200).json({ message: 'success', data: isExistData });
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
});

export const updateSubCategory = catchAsyncError(async (req, res, next) => {
    try {
      let toStoreCategoryInfo = {
          subCategoryName: req.body.subCategoryName,
          subCategoryImage: req.body.updateImage ? req.body.image : req.body.subCategoryImage,
          categoryId: req.body.categoryId,
          isActive: req.body.status ? 1 : 0
        }
        await SubCategory.findOneAndUpdate({ _id: req.params.subCategoryId }, toStoreCategoryInfo, { upsert: true })
        res.status(200).json({ message: 'update successful!', statusCode: 200 })
    } catch (error) {
        console.log('error::', error)
        res.status(500).json({ message: "An error occured" });
    }
});

export const deleteSubCategory = catchAsyncError(async (req, res, next) => {
    try {
     let subcatData=  await SubCategory.findById(req.params.id);
     subcatData.isDeleted=1;

     await subcatData.save();
     console.log('subcatData::',subcatData)
        // await SubCategory.findOneAndUpdate({ _id: req.params.categoryId }, toStoreCategoryInfo, { upsert: true })
        res.status(200).json({ message: 'update successful!', statusCode: 200 })
    } catch (error) {
        console.log('error::', error)
        res.status(500).json({ message: "An error occured" });
    }
});

export const getSubcategoryByCategoryId = catchAsyncError(async (req, res, next) => {
    try {
     const subCategory= await SubCategory.find({categoryId: req.params.categoryId,isDeleted: 0});
        res.status(200).json({ message: 'success', subCategory: subCategory});
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
});
