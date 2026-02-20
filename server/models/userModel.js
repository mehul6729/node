import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  flatNo: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

// add Cart schema as well
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    verifyOtp: {
      type: String,
      default: "",
    },

    verifyOtpExpireAt: {
      type: Date,
    },

    resetOtp: {
      type: String,
      default: "",
    },

    resetOtpExpireAt: {
      type: Date,
    },

    addresses: [addressSchema],

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;
