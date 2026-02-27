import mongoose from "mongoose";
import path from "path";
import productModel from "../models/productModel.js";
import fs from "fs";
import { fileURLToPath } from "url";

// add Products
export const addProduct = async (req, res) => {
  const { price, discountPrice, images } = req.body;
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Only Admin can add products",
    });
  }

  if (discountPrice && discountPrice > price) {
    return res.status(400).json({
      success: false,
      message: "Discount price cannot be greater than price",
    });
  }

  if (!images || images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one image is required",
    });
  }

  try {
    const product = await productModel.create(req.body); // this save the data in db
    // const product = new productModel(req.body); // this line does not save data in db
    // await product.save(); // after we call save the data is saved
    return res
      .status(200)
      .json({ success: true, message: "Product Added successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const getProducts = async (req, res) => {
  const { category, bestSeller, minPrice, maxPrice, search, sortBy } =
    req.query;
  try {
    const products = await productModel.find().sort({ createdAt: -1 }); // newest first
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    const role = req.user.role;
    const idInvalid = !mongoose.Types.ObjectId.isValid(_id);
    if (idInvalid) {
      return res.status(200).json({
        success: false,
        message: "invalid product id",
      });
    }

    if (role === "admin") {
      const product = await productModel.findById(_id);
      if (product) {
        const updatedProduct = await productModel.findByIdAndUpdate(
          _id,
          updateData,
          {
            new: true, // return updated document
            runValidators: true, // run schema validation
          },
        );
        return res.status(200).json({
          success: true,
          message: "Product Updated",
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "inValid product id",
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Only admin can update the products",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId)
      return res.status(200).json({
        success: false,
        message: "Invaild Product id",
      });

    const product = await productModel.findById(id);
    if (product) {
      return res.status(200).json({
        success: true,
        message: "Product Found",
        data: product,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const imgSave = async (req, res) => {
  const user = req.user;

  try {
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only for admin",
      });
    }

    if (!req.file || !req.file.filename) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    const savedPath = path
      .join("productImg", req.file.filename)
      .replace(/\\/g, "/");

    return res.status(200).json({
      success: true,
      message: "Image saved successfully",
      data: savedPath,
    });
  } catch (error) {
    console.error("imgSave error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteImg = async (req, res) => {
  const user = req.user;
  const fileName = req.body.fileName;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, `../productImg/${fileName}`);

  try {
    if (!fileName) {
      return res.status(200).json({
        success: false,
        message: "Add file name",
      });
    }
    if (user.role === "admin") {
      if (!fs.existsSync(filePath)) {
        return res.status(200).json({
          success: false,
          message: "File don't exists",
        });
      }
      const removeImg = fs.unlinkSync(filePath);

      return res.status(200).json({
        success: true,
        message: "Img Deleted successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Only for admin",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
