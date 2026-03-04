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

    // 4️ Update cart (merge)
    const user = await userModel.findById(userId);

    for (const item of cart) {
      const existingItem = user.cart.find(
        (c) => c.product.toString() === item.product,
      );

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

export const setCart = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart)) {
      return res.status(400).json({
        success: false,
        message: "Cart must be an array",
      });
    }
    const userId = req.user.id;

    if (cart.length === 0) {
      const user = await userModel.findById(userId);
      user.cart = [];
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Cart updated",
        cart: [],
      });
    }

    const invalidIndex = cart.findIndex(
      (item) => !mongoose.Types.ObjectId.isValid(item.product),
    );
    if (invalidIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: `Invalid product id at index ${invalidIndex}`,
      });
    }

    const productIds = cart.map((item) => item.product);
    const products = await productModel.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products not found",
      });
    }

    const user = await userModel.findById(userId);
    user.cart = cart.map((item) => ({
      product: item.product,
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, addresses } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined && typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }
    if (phone !== undefined) {
      user.phone = phone === "" || phone == null ? undefined : String(phone);
    }
    if (addresses !== undefined && Array.isArray(addresses)) {
      const valid = addresses.every(
        (a) =>
          a &&
          typeof a.flatNo === "string" &&
          typeof a.street === "string" &&
          typeof a.city === "string" &&
          typeof a.state === "string" &&
          typeof a.country === "string" &&
          typeof a.pincode === "string",
      );
      if (!valid) {
        return res.status(400).json({
          success: false,
          message:
            "Each address must have flatNo, street, city, state, country, pincode",
        });
      }
      user.addresses = addresses.map((a) => ({
        flatNo: a.flatNo.trim(),
        street: a.street.trim(),
        city: a.city.trim(),
        state: a.state.trim(),
        country: a.country.trim(),
        pincode: a.pincode.trim(),
        isDefault: Boolean(a.isDefault),
      }));
      if (
        user.addresses.length > 0 &&
        !user.addresses.some((a) => a.isDefault)
      ) {
        user.addresses[0].isDefault = true;
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId).populate("cart.product");

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
