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

// export const isAuthenticated = catchAsyncError(async (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization) {
//     return next(new ErrorHandler("User is not authenticated.", 401));
//   }

//   const token = authorization.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     req.user = await User.findById(decoded.id) || await Student.findById(decoded.id);

//     if (!req.user) {
//       return next(new ErrorHandler("User not found.", 404));
//     }

//     next();
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       // Token has expired
//       return next(new ErrorHandler("Token expired. Please log in again.", 401));
//     } else if (err.name === "JsonWebTokenError") {
//       // Invalid token
//       return next(new ErrorHandler("Invalid token. Please log in again.", 401));
//     } else {
//       return next(new ErrorHandler("Authentication error.", 401));
//     }
//   }
// });
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  // console.log(req.cookies

  // )
  // const { token } = req.cookies;
  // if (!token) {
  //   return next(new ErrorHandler("User is not authenticated.", 400));
  // }
  // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // req.user = await User.findById(decoded.id);
//   const { adminToken, studentToken } = req.cookies;
// console.log('req.cookies::',req.cookies,req.originalUrl)
//   let token=null;
//   if (req.originalUrl.startsWith("/admin")) token = adminToken;
// else if (req.originalUrl.startsWith("/student")) token = studentToken;
//   // const token = req.cookies.adminToken || req.cookies.studentToken;
// if (!token) return next(new ErrorHandler("Not authenticated", 400));
// console.log('adminToken::',adminToken)
// console.log('studentToken::',studentToken)

// const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
// req.user = adminToken ? await User.findById(decoded.id) : req.cookies.studentToken;
// next();
  let token = null;
  let role = null;
 const source = req.headers["x-app-type"]; 
 console.log('req.cookies::',source)

  if (source=='student') {
    token = req.cookies.studentToken;
    role = "student";
  } else  {
    token = req.cookies.adminToken;
    role = "user";
  }
  if (!token) {
    return next(new ErrorHandler("Not authenticated", 401));
  }
console.log((source=='admin'))
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded)
  req.user = (source=='admin') ? await User.findById(decoded.id) : await Student.findById(decoded.id);
  req.role = role;
  next();

});

// export const isStudentAuthenticated = catchAsyncError(async (req, res, next) => {
//   console.log(req.cookies

//   )
//   const { studentToken } = req.cookies;
//   if (!studentToken) {
//     return next(new ErrorHandler("User is not authenticated.", 400));
//   }
//   const decoded = jwt.verify(studentToken, process.env.JWT_SECRET_KEY);

//   req.user = await Student.findById(decoded.id);
//   next();
// });









