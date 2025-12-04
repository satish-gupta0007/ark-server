import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { getResetPasswordTemplate, getWelcomeTemplate } from "../utils/templates.js";
import { Student } from "../models/studentModel.js";
import jwt from "jsonwebtoken";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, userType, isStudent, isActive } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already used.", 400));
    }

    // limit: max 3 attempts with unverified account
    const registerationAttemptsByUser = await User.find({
      email,
      accountVerified: false,
    });

    if (registerationAttemptsByUser.length >= 3) {
      return next(
        new ErrorHandler(
          "You have exceeded the maximum number of attempts (3). Please try again after an hour.",
          400
        )
      );
    }

    let userData = { name, email, userType, password, isActive };
if (userType=='college'){
userData['collegeName']=req.body.collegeName;
}
    const user = await User.create(userData);
    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const encodedToken = encodeURIComponent(Buffer.from(resetToken).toString("base64"));
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${encodedToken}`;
    const message = getWelcomeTemplate(user.email, resetPasswordUrl);  // await user.save({ validateBeforeSave: false });
    await sendEmail({
      from: `"Your App Name" <${process.env.SMTP_MAIL}>`,
      email: user.email,
      // subject: "Forgot Password",
      subject: "Welcome to UNITYM 🎉 | Set up your password",
      message,
    });

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    next(error);
  }
});

export const updateUser = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, userType, password, status } = req.body;

    let user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (userType !== undefined) user.userType = userType;
    if (password !== undefined) user.password = password;
    if (status !== undefined) user.isActive = status ? 1 :0;


    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
});

async function sendVerificationCode(
  verificationMethod,
  verificationCode,
  name,
  email,
  phone,
  res
) {
  try {
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode);
      sendEmail({ email, subject: "Your Verification Code", message });
      return {
        success: true,
        message: `Verification email successfully sent to ${name}`,
      };
    } else if (verificationMethod === "phone") {
      const verificationCodeWithSpace = verificationCode
        .toString()
        .split("")
        .join(" ");
      await client.calls.create({
        twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}.</Say></Response>`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      return {
        success: true,
        message: `OTP sent.`,
      };
    } else {
      return {
        success: false,
        message: "Invalid verification method.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Verification code failed to send.",
    };
  }
}

// ------------------ EMAIL TEMPLATE ------------------
function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>UNITYM</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}

// ------------------ VERIFY OTP ------------------
export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    if (!user) {
      return next(new ErrorHandler("User not found or already verified.", 404));
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP.", 400));
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired.", 400));
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, "Account Verified.", res);
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error.", 500));
  }
});

export const login = catchAsyncError(async (req, res, next) => {
  try {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }
  const user = await User.findOne({ email, accountVerified: true }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorHandler("User not verified.", 400));
  } else if (!user['isActive']) {
    return next(new ErrorHandler("User is inactive.", 400));

  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  sendToken(user, 200, "User logged in successfully.", res);   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 
});

export const adminRefreshToken = async (req, res,next) => {
  try {
    console.log('req.cookies::',req.cookies)
    console.log('admin-refresh')
    const refreshToken = req.cookies.adminRefresh;
  if (!refreshToken) {
    return next(new ErrorHandler("No refresh token provided", 401));
  }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
    console.log('decoded::',decoded)
    const user = await User.findById(decoded.id);
    if (!user) return next(new ErrorHandler("User not found", 404));
    const newAccessToken = user.generateToken();
    console.log('newAccessToken::',newAccessToken)
    res.cookie("adminToken", newAccessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 60 * 1000),
      sameSite: "strict",
    });
    return res.status(200).json({
      success: true,
      message: "Token refreshed",
    });

  } catch (err) {
    return next(new ErrorHandler("Invalid refresh token", 401));
  }
};


// ------------------ LOGOUT ------------------
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  try {
     const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 
});

export const getAllUser = catchAsyncError(async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    users,
  });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
  
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email, userType: req.body.userType });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const encodedToken = encodeURIComponent(Buffer.from(resetToken).toString("base64"));
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${encodedToken}`;
const message = getResetPasswordTemplate(req.body.email, resetPasswordUrl);
  try {
    await sendEmail({
      email: user.email,
      subject: "Forgot Password",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler(
        error.message ? error.message : "Cannot send reset password token.",
        500
      )
    );
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const { student, password, cPassword } = req.body;
  if (!token) {
    return next(new ErrorHandler("Token is required.", 400));
  }

  if (!password || !cPassword) {
    return next(new ErrorHandler("Password and confirm password are required.", 400));
  }

  if (password !== cPassword) {
    return next(new ErrorHandler("Password and confirm password do not match.", 400));
  }
  const newToken = btoa(token)
  const decodedToken = Buffer.from(newToken, "base64").toString("utf8");
  const hashedToken = crypto.createHash("sha256").update(decodedToken).digest("hex");
  const Model = student ? Student : User;
  const user = await Model.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("Reset password token is invalid or has expired.", 400)
    );
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.accountVerified = true;
  user.isDeleted = 1;
  await user.save();

  sendToken(user, 200, "Password reset successfully.", res);
});
