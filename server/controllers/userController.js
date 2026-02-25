import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart)) {
      return res.status(400).json({
        success: false,
        message: "Cart must be an array",
      });
    }

    const userId = req.user.id;

    // 1️ Validate ObjectId format
    const invalidIndex = cart.findIndex(
      (item) => !mongoose.Types.ObjectId.isValid(item.product),
    );

    if (invalidIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: `${invalidIndex} index id is invalid`,
      });
    }

    // 2 Extract all IDs
    const productIds = cart.map((item) => item.product);

    // 3️ If invalid ObjectId includes in DB return id[]
    const products = await productModel.find({
      _id: { $in: productIds },
    });

    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p._id.toString());

      const invalidIndex = cart.findIndex(
        (item) => !foundIds.includes(item.product),
      );

      return res.status(400).json({
        success: false,
        message: `${invalidIndex} index id is invalid`,
      });
    }

    // 4️ Update cart
    const user = await userModel.findById(userId);

    for (const item of cart) {
      const existingItem = user.cart.find(
        (c) => c.product.toString() === item.product,
      );

      // if item then add quantity else add to cart
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        user.cart.push({
          product: item.product,
          quantity: item.quantity || 1,
        });
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);

    if (user) {
      return res.status(200).json({
        success: true,
        message: "",
        data: user,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
