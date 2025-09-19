import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: {
    type: String,
    minLength: [8, "Password must have at least 8 characters."],
    maxLength: [32, "Password cannot have more than 32 characters."],
    select: false,
  },
  phone: String,
  userType: {
    type: String,
    required: [true, "User type is required"],    // 👈 already required
    enum: ["student", "college", "admin","super-admin"],       // optional, restrict values
  },
  accountVerified: { type: Boolean, default: false },
  verificationCode: Number,
  verificationCodeExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isAdminUser: { type: Boolean, default: true },
  // name: { type: Boolean, default: false },
  //   date_of_birth:  { type: Boolean, default: false },
  //   phone_number: { type: Boolean, default: false },
  //   aadhar_number: { type: Boolean, default: false },
  //   blood_group: { type: Boolean, default: false },
  //   father_name: { type: Boolean, default: false },
  //   mother_name: { type: Boolean, default: false },
  //   address: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateVerificationCode = function () {
  function generateRandomFiveDigitNumber() {
    const code = Math.floor(100000 + Math.random() * 900000);

  this.verificationCode = code;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // expires in 10 mins

  return code;
  }
  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

  return verificationCode;
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", userSchema);
