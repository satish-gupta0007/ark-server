import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ProductImagesSchema, ProductInfo } from "../models/productModel.js";
import { SubCategory } from "../models/sucategoryModel.js";

export const addProductDetails = catchAsyncError(async (req, res, next) => {
    try {
        let productInfo = {
            productName: req.body.productName,
            categoryId: req.body.categoryName,
            subCategoryId: req.body.subCategoryName,
            actualPrice: req.body.actualPrice,
            salesPrice: req.body.salesPrice,
            weight: req.body.weight,
            width: req.body.width,
            height: req.body.height,
            depth: req.body.depth,
            description: req.body.description,
            isDeleted: 0,
            isActive: 1
        }
        console.log("productInfo::", productInfo)
        await new ProductInfo(productInfo).save();
        res.status(200).json({ message: 'success', statusCode: 200 });
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
});


export const updateProductDetails = catchAsyncError(async (req, res, next) => {
    try {
        let productInfo = {
            productName: req.body.productName,
            categoryId: req.body.categoryName,
            subCategoryId: req.body.subCategoryName,
            actualPrice: req.body.actualPrice,
            salesPrice: req.body.salesPrice,
            weight: req.body.weight,
            width: req.body.width,
            height: req.body.height,
            depth: req.body.depth,
            description: req.body.description,
            isActive: req.body.status ? '1' : '0'
        }
        await ProductInfo.updateOne({ _id: req.params.productId }, productInfo, { upsert: true })
        if (!productUpdated) {
            return res.status(404).send({ message: 'No Existing Product' });

        } else {
            return res.status(200).send({ message: 'success', statusCode: 200 });
        }
    } catch (error) {
        console.log('error::', error)
        res.status(500).json({ message: "An error occured" });
    }
});


export const getAllProductList = catchAsyncError(async (req, res, next) => {
    try {
        const products = await ProductInfo.find();

        // 2️⃣ Add images for each product
        const result = await Promise.all(
            products.map(async (product) => {
                const images = await ProductImagesSchema.findOne({ productId: product._id });

                return {
                    ...product._doc,
                    ProductImages: images,
                };
            })
        );

        return res.status(200).json({
            success: true,
            total: result.length,
            products: result,
        });
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
});

export const getProductDetails = catchAsyncError(async (req, res, next) => {
    try {
        const { productId } = req.params;

        // 1️⃣ Find product
        const product = await ProductInfo.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // 2️⃣ Find all images for the product
        const images = await ProductImagesSchema.find({ productId });
        return res.status(200).json({
            success: true,
            product,
            images,
        });
    } catch (error) {
        console.log('error::', error)
        res.status(500).json({ message: "An error occured" });
    }
});

export const getProductImages = catchAsyncError(async (req, res, next) => {
    try {
        const results = await ProductImagesSchema.findOne({ productId: req.params.productId })
        res.status(200).json({ message: "success", data: results });
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
});

export const addProductImages = catchAsyncError(async (req, res, next) => {
    try {
        var images = req.body;
        let productImages = {};
        let smallImages, mediumImage, largeImage;
        images.forEach((eachImages) => {
            if (eachImages.includes('small_images')) {
                smallImages = eachImages;
                productImages.smallImage = smallImages;
            }
            else if (eachImages.includes('medium_images')) {
                mediumImage = eachImages;
                productImages.mediumImage = mediumImage;
            }
            else if (eachImages.includes('large_images')) {
                largeImage = eachImages;
                productImages.largeImage = largeImage;
            }
        })

        // forEach(images, (eachImages) => {
        //     if (eachImages.includes('small_images')) {
        //         smallImages = eachImages;
        //         productImages.smallImage = smallImages;
        //     }
        //     else if (eachImages.includes('medium_images')) {
        //         mediumImage = eachImages;
        //         productImages.mediumImage = mediumImage;
        //     }
        //     else if (eachImages.includes('large_images')) {
        //         largeImage = eachImages;
        //         productImages.largeImage = largeImage;

        //     }
        // });
        console.log('productImages::', productImages)
        const productUpdated = await ProductImagesSchema.updateOne({ productId: req.params.productId }, productImages, { upsert: true });
        if (!productUpdated) {
            return res.status(404).send({ message: 'Product not exist' });

        }
        else {
            return res.status(200).send({ message: 'success' });
        }
    } catch (error) {
        console.log('error::', error)
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



export const deleteSubCategory = catchAsyncError(async (req, res, next) => {
    try {
        let subcatData = await SubCategory.findById(req.params.id);
        subcatData.isDeleted = 1;

        await subcatData.save();
        console.log('subcatData::', subcatData)
        // await SubCategory.findOneAndUpdate({ _id: req.params.categoryId }, toStoreCategoryInfo, { upsert: true })
        res.status(200).json({ message: 'update successful!', statusCode: 200 })
    } catch (error) {
        console.log('error::', error)
        res.status(500).json({ message: "An error occured" });
    }
});
