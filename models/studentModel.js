import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const studentSchema = new mongoose.Schema({
    email: String,
    password: {
        type: String,
        minLength: [8, "Password must have at least 8 characters."],
        maxLength: [32, "Password cannot have more than 32 characters."],
        select: false,
    },
    accountVerified: { type: Boolean, default: false },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // name: { type: Boolean, default: false },
    firstName:{type: String},
    lastName:{type: String},
    date_of_birth: { type: String, default: null },
    phone_number: { type: String, default: null },
    aadhar_number: { type: String, default: null },
    blood_group: { type: String, default: null },
    father_name: { type: String, default: null },
    mother_name: { type: String, default: null },
    address: { type: String, default: null },
    field_of_interest: { type: String, default: null },
    college_name: { type: String, default: null },
    enrollment_number: { type: String, default: null },
    branch: { type: String, default: null },
    semester: { type: String, default: null },
    bio: { type: String, default: null },
    isMember: { type: Boolean, default: false },
    isProfileCompleted: { type: Boolean, default: false },
    profileImage: { type: String, default: null },
    isStepOneCompleted: { type: Boolean, default: null },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

studentSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

studentSchema.methods.generateVerificationCode = function () {
//     function generateRandomFiveDigitNumber() {
//        const code = Math.floor(100000 + Math.random() * 900000);

//   this.verificationCode = code;
//   this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // expires in 10 mins

//   return code;
//     }
//     const verificationCode = generateRandomFiveDigitNumber();
//     console.log('verificationCode;:',verificationCode)
//     this.verificationCode = verificationCode;
//     this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

//     return verificationCode;
const code = Math.floor(100000 + Math.random() * 900000); // always 6 digits

  this.verificationCode = code;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 mins

  return code;
};

studentSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// studentSchema.methods.generateResetPasswordToken = function () {
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     this.resetPasswordToken = crypto
//         .createHash("sha256")
//         .update(resetToken)
//         .digest("hex");

//     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//     return resetToken;
// };
// studentSchema.methods.generateResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//   return resetToken;
// };

studentSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex"); // plain token

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
console.log('this.resetPasswordExpire:::',this.resetPasswordExpire)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

  return resetToken; // return plain token (not hashed)
};

export const Student = mongoose.model("StudentUser", studentSchema);
