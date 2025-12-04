import mongoose from "mongoose";
const productInfoSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    categoryId: {
         type: mongoose.Schema.Types.ObjectId,
        required: true,
          ref: "Category",
    },
    subCategoryId: {
         type: mongoose.Schema.Types.ObjectId,
           ref: "sub-category",
    },
    actualPrice: {
        type: String,
        required: true,
    },
    salesPrice: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
    },
    width: {
        type: String,
    },
    actualPrice: {
        type: String,
        required: true,
    },
    height: {
        type: String,
        required: true,
    },
    depth: {
        type: String,
    },
    isActive: {
        type: String,
    },
    description: {
        type: String,
    },
     isDeleted:{type: Number, default: 0},
       createdAt: {
    type: Date,
    default: Date.now,
  },
    ProductImages: 
        { type: mongoose.Schema.Types.ObjectId, ref: 'product-images',default:null }
    ,
    ProductInventories: { type: mongoose.Schema.Types.ObjectId, ref: 'product-options-inventory',default:null },
});

const productImageSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    smallImage: {
        type: String,
    },
    mediumImage: {
        type: String,
    },
    largeImage: {
        type: String,
    },
      createdAt: {
    type: Date,
    default: Date.now,
  },
    // products: [{ type: Schema.Types.ObjectId, ref: 'product' }]
});

const productOptonsSchema = new mongoose.Schema({
       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },

    colourValue: {
        type: Object,
    },
    sizeValue: {
        type: Object,
    },
      createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productOptonsInventoriesSchema = new mongoose.Schema({
       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },

    colourValue: {
        type: Object,
    },
    sizeValue: {
        type: Object,
    },
    stockStatus:{
        type:Number
    },
    quantity:{
        type:Number
    },
      createdAt: {
    type: Date,
    default: Date.now,
  },
});

const favoriteProductSchema = new mongoose.Schema({
       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    // productId: { type: Schema.Types.ObjectId, ref: 'product' },

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    ProductImages: { type: mongoose.Schema.Types.ObjectId, ref: 'product-images' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
    // ProductImages: [{ type: Schema.Types.ObjectId, ref: 'product-images' }],
});


export const ProductInfo = mongoose.model("product", productInfoSchema);
export const ProductImagesSchema = mongoose.model("product-images", productImageSchema);
export const ProductOptionsSchema = mongoose.model("product-options", productOptonsSchema);
export const ProductOptionsInventorySchema = mongoose.model("product-options-inventory", productOptonsInventoriesSchema);
export const favoriteProductsSchema = mongoose.model("favorite-products", favoriteProductSchema);

// export const Category = mongoose.model("Category", categorySchema);

// module.exports = { ProductInfo,ProductImagesSchema,ProductOptionsSchema,ProductOptionsInventorySchema,favoriteProductsSchema };