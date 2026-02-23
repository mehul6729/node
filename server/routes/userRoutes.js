import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import { userAuth } from "../middleware/userAuth.js";
import { addToCart } from "../controllers/userController.js";

const userRoutes = express.Router();
userRoutes.post("/create/order", placeOrder);
userRoutes.post("/cart", userAuth, addToCart);

export default userRoutes;
