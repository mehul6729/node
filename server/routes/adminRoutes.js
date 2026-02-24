import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import {
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const adminRoutes = express.Router();
adminRoutes.get("/get/orders", userAuth, getOrders);
adminRoutes.post("/update/order/status", userAuth, updateOrderStatus);

export default adminRoutes;
