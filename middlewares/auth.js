import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Student } from "../models/studentModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new ErrorHandler("User is not authenticated.", 400));
  }
  const token = authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);
  if (!req.user || req.user === null) {
    req.user = await Student.findById(decoded.id);
  }
  next();
});


