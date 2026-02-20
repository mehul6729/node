import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import productModel from "../models/productModel.js";

// making a function to register user in our db
export const register = async (req, res) => {
  // we are get data from frontend
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    // find the email in db
    const existingUser = await userModel.findOne({ email }).lean(); //Used .lean() for faster findOne (skips full Mongoose document overhead)
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // name, email and password is getting saved in db
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // created a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //
    });
    // sending email
    transporter
      .sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: `Welcome ${name}`,
        text: `Your account has been added with email: ${email}`,
      })
      .catch((err) => console.error("Email send error:", err));

    return res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error); // log internally
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// Login function
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({ success: false, message: "Email and password is required" });
  }

  try {
    const user = await userModel.findOne({ email }).lean();

    if (!user) {
      res.json({ success: false, message: "Invalid email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // day hr min sec ms
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// logout function
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // day hr min sec ms
    });

    return res.json({ success: true, message: "logged out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// send  otp to the user's email
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    transporter
      .sendMail({
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Account Verification OTP",
        text: `Your OTP is ${otp}`,
      })
      .catch((err) => console.error("Email send error:", err));

    return res.json({ success: true, message: "Otp sended" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// Verify OTP function
export const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;

  try {
    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not Found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid Otp" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Otp has been expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email verified" });
  } catch (error) {
    return res.json({ success: true, message: error.message });
  }
};

// check user this valid or not
export const isAuthenticate = async (req, res) => {
  try {
    return res.json({ success: true, message: "Authenticated user" });
  } catch (error) {
    console.log("isAuthenticate funtion");
    return res.json({ success: false, message: error.message });
  }
};

// send reset password OTP
export const resetPasswordOtp = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.json({ success: false, message: "Missing Token" });
  }
  const user = await userModel.findById(userId);

  if (!user) {
    return res.json({ success: false, message: "User not Found" });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.restOtp = otp;
  user.restOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();
  transporter
    .sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Re-set Password OTP",
      text: `Your OTP is ${otp}`,
    })
    .catch((err) => console.error("Email send error:", err));

  return res.json({ success: true, message: "Re-rest password Otp sent" });
};

// verify re-set password OTP
export const verifyResetPasswordOtp = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return res.json({ success: false, message: "user not found" });
  }

  if (user.restOtp === "" || user.restOtp !== otp) {
    return res.json({ success: false, message: "Invalid Otp" });
  }

  if (user.restOtpExpiredAt < Date.now()) {
    return res.json({ success: false, message: "Invalid Expired" });
  }

  user.restOtpExpiredAt = 0;
  user.restOtp = "";
};

// add Products
export const addProduct = async (req, res) => {
  const {
    title,
    description,
    price,
    discountPrice,
    images,
    category,
    variants,
    brand,
    stock,
    isActive,
    rating,
    numReviews,
  } = req.body;

  const product = await productModel.create(req.body); // this save the data in db

  // const product = new productModel(req.body); // this line does not save data in db
  // await product.save(); // after we call save the data is saved
};
