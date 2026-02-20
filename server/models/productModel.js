import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    category: {
      type: String,
      required: true,
    },

    variants: [
      {
        size: String,
        color: String,
        offer_type: String,
        purchase_count: Number,
      },
    ],

    brand: {
      type: String,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  },
);

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
