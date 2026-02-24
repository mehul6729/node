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
authRouter.post("/verify/otp", userAuth, verifyEmail); // not in use
authRouter.post("/is-auth", userAuth, isAuthenticate); // not in use
authRouter.post("/send/reset/password/otp", userAuth, resetPasswordOtp); // not in use

export default authRouter;
