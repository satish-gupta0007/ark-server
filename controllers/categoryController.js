import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { Category } from "../models/categoryModel.js";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const addCatgeory = catchAsyncError(async (req, res, next) => {
    try {
        const { name, isActive, parentId, categoryImage, level,categoryDesc,categoryBrief,addedBy,componentType,order } = req.body;


        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return next(new ErrorHandler("Category name is already exist.", 400));
        }

        const categoryData = { name, isActive, parentId, categoryImage, level,categoryBrief,categoryDesc,addedBy,componentType,order };
        const category = await Category.create(categoryData);
        const result = await category.save();
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});


export const getAllCategoryList = catchAsyncError(async (req, res, next) => {
    try {
        const result = await Category.find({ isActive: true });
        res.status(200).json({ data: result });
    } catch (error) {
        next(error);
    }
});

export const updategCategry = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params; // userId from route
        const { name, isActive, categoryImage,categoryDesc,categoryBrief,componentType,order } = req.body;
// ------------------ REGISTER ------------------
        let category = await Category.findById(id);
        if (!category) {
            return next(new ErrorHandler("Category not found", 404));
        }

        if (name !== undefined) category.name = name;
        if (isActive !== undefined) category.isActive = isActive;
        if (categoryImage !== undefined) category.categoryImage = categoryImage;
        if (categoryDesc !== undefined) category.categoryDesc = categoryDesc;
        if (categoryBrief !== undefined) category.categoryBrief = categoryBrief;
        if (categoryImage !== undefined) category.categoryImage = categoryImage;
        if (componentType !== undefined) category.componentType = componentType;
        if (order !== undefined) category.order = order;


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

export const getCategoryList = catchAsyncError(async (req, res, next) => {
    try {
    const all = await Category.find({isActive:true,isDeleted:null}).lean();
    const tree = buildTree(all, null);
    res.status(200).json({data:tree});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
 
});
export const getActiveCategoryList = catchAsyncError(async (req, res, next) => {
    try {
    const all = await Category.find({isActive:true,isDeleted:null}).lean();
    const tree = buildTree(all, null);
    res.status(200).json({data:tree});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
 
});
export const getCategoryBasedOnId = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Get all categories
    const all = await Category.find().lean();

    // 2. Build full tree
    const tree = buildTree(all, null);

    // 3. Find subtree starting from this id
    function findNode(nodeList, nodeId) {
      for (const node of nodeList) {
        if (node._id.toString() === nodeId) return node;
        const found = findNode(node.children || [], nodeId);
        if (found) return found;
      }
      return null;
    }

    const subtree = findNode(tree, id);

    res.status(200).json({ data: subtree });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const deleteCategory = catchAsyncError(async (req, res, next) => {
 try {
        const { id } = req.params; 
        let category = await Category.findById(id);
        if (!category) {
            return next(new ErrorHandler("Category not found", 404));
        }
        category.isDeleted=1;
        await category.save();

        res.status(200).json({
            success: true,
            message: "Category Deleted successfully"
          });
    } catch (error) {
        next(error);
    }
});

function buildTree(categories, parentId = null) {
  return categories
    .filter(cat => (cat.parentId ? cat.parentId.toString() : null) === parentId)
    .map(cat => ({
      ...cat,
      children: buildTree(categories, cat._id.toString())
    }));
}

//  // Utility to build tree recursively
// function buildTree(categories, parentId = null) {
//   return categories
//     .filter(cat => cat.parentId === parentId)
//     .map(cat => ({
//       ...cat,
//       children: buildTree(categories, cat._id.toString())
//     }));
// }