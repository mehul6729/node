import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import transporter from "../config/nodemailer.js";
import { ADMIN_DETAILS } from "../utility/constants/adminConstants.js";

// export const placeOrder = async (req, res) => {
//   const { items, paymentMethod, totalAmount, isPaid } = req.body;
//   try {
//     const userId = req.user.id;
//     let orderData = {
//       user: userId,
//       items: items,
//       totalAmount: totalAmount,
//       isPaid: isPaid,
//       paymentMethod: paymentMethod,
//     };
//     const user = await userModel.findById(userId);

//     // check if all the product id are in objectId format
//     const invalidId = items.findIndex(
//       (item) => !mongoose.Types.ObjectId.isValid(item.product),
//     );
//     if (invalidId !== -1) {
//       return res.status(400).json({
//         success: false,
//         message: `${invalidId} index id is invalid in item []`,
//       });
//     }
//     //=========================================================

//     // ======= check if all product id exisits in db ==========
//     // create any [] of product id
//     const productIds = items.map((item) => item.product);

//     // check the id ecisits in db
//     const products = await productModel.find({
//       _id: { $in: productIds },
//     });

//     if (products.length !== productIds.length) {
//       return res.status(400).json({
//         success: false,
//         message: "One or more product IDs are invalid",
//       });
//     }
//     //=========================================================

//     if (user) {
//       const order = await orderModel.create(orderData);
//       return res
//         .status(200)
//         .json({ success: true, message: "Order Added successfully" });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, paymentMethod } = req.body;
    const userId = req.user.id;

    // Basic validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Validate ObjectId format
    const invalidIndex = items.findIndex(
      (item) => !mongoose.Types.ObjectId.isValid(item.product),
    );

    if (invalidIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: `${invalidIndex} index product id is invalid`,
      });
    }

    // Get products in single query
    const productIds = items.map((item) => item.product);

    const products = await productModel
      .find({
        _id: { $in: productIds },
      })
      .session(session);

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products do not exist",
      });
    }

    // Calculate total & check stock
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.product);

      // check the quantity of the perticular size and color if size and color are null then check item.quantity
      if (item.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      if (product.stock < item.quantity) {
        throw new Error(`${product.title} is out of stock`);
      }

      // reduce stock
      product.stock -= item.quantity;
      await product.save({ session });

      totalAmount += product.price * item.quantity;

      // snapshot data
      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    //  Create order
    const order = await orderModel.create(
      [
        {
          user: userId,
          items: orderItems,
          paymentMethod,
          totalAmount,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    transporter
      .sendMail({
        from: process.env.SENDER_EMAIL,
        to: ADMIN_DETAILS.email,
        subject: `New order arrived, take action!! ${ADMIN_DETAILS.name}`,
        text: `You have got any order, check your admin account`,
      })
      .catch((err) => console.error("Email send error:", err));

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    const orders = await orderModel.find().sort({ createdAt: -1 });

    console.log(user.role);

    if (user.role === "admin") {
      return res.status(200).json({
        success: true,
        message: "OKAY",
        count: orders?.length,
        orders: orders,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Only for admin",
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

export const updateOrderStatus = async (req, res) => {
  const { order_id, paymentStatus, orderStatus } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(order_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }
    const order = await orderModel.findById(order_id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus === "Paid") {
      order.isPaid = true;
      order.paidAt = new Date();
    }
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
