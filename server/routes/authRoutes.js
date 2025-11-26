import express from "express";
import {
  isAuthenticate,
  register,
  resetPasswordOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";
import { login, logout } from "../controllers/authController.js";
import { userAuth } from "../middleware/userAuth.js";

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send/otp", userAuth, sendVerifyOtp);
authRouter.post("/verify/otp", userAuth, verifyEmail);
authRouter.post("/is-auth", userAuth, isAuthenticate);
authRouter.post("/send/reset/password/otp", userAuth, resetPasswordOtp);

export default authRouter;
