import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Student } from "../models/studentModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { getResetPasswordTemplate } from "../utils/templates.js";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, userType, isStudent } = req.body;
    const verificationMethod = 'email';
    const existingUser = await Student.findOne({
      $or: [
        {
          email,
        },
      ],
    });

    if (existingUser) {
      return next(new ErrorHandler("Email is already used.", 400));
    }
    const registerationAttemptsByUser = await Student.find({
      $or: [
        { email, accountVerified: false },
      ],
    });

    if (registerationAttemptsByUser.length > 3) {
      return next(
        new ErrorHandler(
          "You have exceeded the maximum number of attempts (3). Please try again after an hour.",
          400
        )
      );
    }

    const userData = {
      name,
      email,
      userType,
      password,
    };

    const user = await Student.create(userData);
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    const result = await sendVerificationCode(
      verificationMethod,
      verificationCode,
      name,
      email
    );
    res.status(200).json(result);

  } catch (error) {
     res.status(500).json({ error: error.message });
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
      return { success: true, message: `Verification email successfully sent to ${name}` };

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
      res.status(200).json({
        success: true,
        message: `OTP sent.`,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Invalid verification method.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    });
  }
}

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

export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const userAllEntries = await Student.find({
      $or: [
        {
          email,
          accountVerified: false,
        }
      ],
    }).sort({ createdAt: -1 });

    if (!userAllEntries) {
      return next(new ErrorHandler("User not found.", 404));
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];

      await Student.deleteMany({
        _id: { $ne: user._id },
        $or: [
          { email, accountVerified: false },
        ],
      });
    } else {
      user = userAllEntries[0];
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

export const studendResendVerificationCode = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email, accountVerified: false });

    if (!student) {
      return next(new ErrorHandler("Student not found or already verified.", 404));
    }

    const now = Date.now();
    if (student.lastVerificationCodeSentAt) {
      const elapsed = (now - student.lastVerificationCodeSentAt.getTime()) / 1000;
      if (elapsed < 60) {
        return next(
          new ErrorHandler(
            `Please wait ${Math.ceil(60 - elapsed)} seconds before requesting another code.`,
            429
          )
        );
      }
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      student.verificationResendCount &&
      student.lastVerificationCodeSentAt &&
      student.lastVerificationCodeSentAt >= today &&
      student.verificationResendCount >= 5
    ) {
      return next(
        new ErrorHandler(
          "You have reached the maximum OTP resend attempts for today (5). Please try again tomorrow.",
          429
        )
      );
    }

    const verificationCode = student.generateVerificationCode();
    student.lastVerificationCodeSentAt = now;
    if (!student.lastVerificationCodeSentAt || student.lastVerificationCodeSentAt < today) {
      student.verificationResendCount = 1;
    } else {
      student.verificationResendCount = (student.verificationResendCount || 0) + 1;
    }
    await student.save();
    const result = await sendVerificationCode(
      "email",
      verificationCode,
      student.name,
      student.email
    );

    return res.status(200).json({
      success: true,
      message: "Verification code resent successfully.",
      result,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to resend verification code.", 500));
  }
});


export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }
  const user = await Student.findOne({ email }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorHandler("Email id is not register.", 400));
  } else if (!user.accountVerified) {
    return next(new ErrorHandler("User not verified.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  
  sendToken(user, 200, "User logged in successfully.", res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
   const {id}=req.params;
  let user = await Student.findById(id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email, isStudent } = req.body;
  const user = await Student.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const encodedToken = encodeURIComponent(Buffer.from(resetToken).toString("base64"));
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/auth/reset-password?isStudent=${isStudent}&token=${encodedToken}`;
  const message = getResetPasswordTemplate(user.email, resetPasswordUrl);

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
        error.message || "Cannot send reset password token.",
        500
      )
    );
  }
});

export const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await Student.find({});
  res.status(200).json({
    success: true,
    users,
  });
});


export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await Student.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password & confirm password do not match.", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, "Reset Password Successfully.", res);
});

export const updateStudentDetails = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    const { firstName, lastName, date_of_birth,
      phone_number, aadhar_number, blood_group, father_name, mother_name, address,
      field_of_interest, college_name, enrollment_number, branch, semester, bio, 
      isMember,profileImage
    } = req.body;

    let user = await Student.findById(id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;
    if (phone_number !== undefined) user.phone_number = phone_number;
    if (aadhar_number !== undefined) user.aadhar_number = aadhar_number;
    if (blood_group !== undefined) user.blood_group = blood_group;
    if (father_name !== undefined) user.father_name = father_name;
    if (mother_name !== undefined) user.mother_name = mother_name;
    if (address !== undefined) user.address = address;
    if (field_of_interest !== undefined) user.field_of_interest = field_of_interest;
    if (college_name !== undefined) user.college_name = college_name;
    if (enrollment_number !== undefined) user.enrollment_number = enrollment_number;
    if (branch !== undefined) user.branch = branch;
    if (semester !== undefined) user.semester = semester;
    if (bio !== undefined) user.bio = bio;
    if (isMember !== undefined) user.isMember = isMember;
    if (profileImage !== undefined) user.profileImage = profileImage;

    
    if (college_name) {
      user.isProfileCompleted = true;
    }else {
      user.isStepOneCompleted = true;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
});