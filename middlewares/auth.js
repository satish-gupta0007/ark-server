// import { catchAsyncError } from "./catchAsyncError.js";
// import ErrorHandler from "./error.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/userModel.js";
// import { Student } from "../models/studentModel.js";

// export const isAuthenticated = catchAsyncError(async (req, res, next) => {
//   const { authorization } = req.headers;
//   if (!authorization) {
//     return next(new ErrorHandler("User is not authenticated.", 400));
//   }
// const token=authorization.split(" ")[1];
//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//   req.user = await User.findById(decoded.id);
//   if (!req.user || req.user===null){
//      req.user = await Student.findById(decoded.id);
//   }
//   next();
// });



import jwt from "jsonwebtoken";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "./error.js";
import { User } from "../models/userModel.js";
import { Student } from "../models/studentModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new ErrorHandler("User is not authenticated.", 401));
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id) || await Student.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found.", 404));
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Token has expired
      return next(new ErrorHandler("Token expired. Please log in again.", 401));
    } else if (err.name === "JsonWebTokenError") {
      // Invalid token
      return next(new ErrorHandler("Invalid token. Please log in again.", 401));
    } else {
      return next(new ErrorHandler("Authentication error.", 401));
    }
  }
});
