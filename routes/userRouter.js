// import express from "express";
// import {
//   register,
//   verifyOTP,
//   login,
//   logout,
//   getUser,
//   forgotPassword,
//   resetPassword,
//   getAllUser,
//   updateUser,
//   adminRefreshToken,
// } from "../controllers/userController.js";
// import {
//   register as studentRegister,
//   verifyOTP as studentVerifyOTP,
//   login as studentLogin,
//   logout as studentLogout,
//   getUser as studentGetuser,
//   forgotPassword as studentForgotpassword,
//   resetPassword as studentResetPassword,
//   getAllUser as studentGetAllUser,
//   studendResendVerificationCode,
//   updateStudentDetails,
//   studentRefreshToken
// } from "../controllers/studentController.js";
// import { isAuthenticated } from "../middlewares/auth.js";

// const router = express.Router();
// //user 
// router.post("/admin/register", register);
// router.post("/admin/otp-verification", verifyOTP);
// router.put("/admin/update/:id",isAuthenticated, updateUser);
// router.post("/admin/login", login);
// router.post("/admin/logout", isAuthenticated, logout);
// router.get("/admin/me", isAuthenticated, getUser);
// router.post("/admin/refresh", adminRefreshToken);
// router.get("/admin/get-all-users" , isAuthenticated,getAllUser);
// router.post("/admin/password/forgot", forgotPassword);
// router.post("/admin/password/reset/:token", resetPassword);

// //student.
// router.post("/student/register", studentRegister);
// router.post("/student/otp-verification", studentVerifyOTP);
// router.post("/student/login", studentLogin);
// router.post("/student/logout", isAuthenticated, studentLogout);
// router.post("/student/refresh", studentRefreshToken);
// router.get("/student/me/:id", isAuthenticated,studentGetuser);
// router.get("/student/get-all-users" , isAuthenticated,studentGetAllUser);
// router.post("/student/password/forgot",studentForgotpassword);
// router.put("/student/password/reset/:token", studentResetPassword);
// router.post("/student/resend-otp", studendResendVerificationCode);
// router.post("/student/profile/step1/:id",isAuthenticated, updateStudentDetails);
// router.post("/student/profile/step2/:id", isAuthenticated,updateStudentDetails);




// export default router;
