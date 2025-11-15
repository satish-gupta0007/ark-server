import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Category } from "../models/categoryModel.js";
import { User } from "../models/userModel.js";
import { AbvpEvent, AbvpEventCategory } from "../models/abvpModel.js";
import { Student } from "../models/studentModel.js";



export const getDashboardData = catchAsyncError(async (req, res, next) => {
  try {
    const [
      studentUserCount,
      userCount,
      abvpMemberCouunt,
      activeEventCount,
      totalEventCount,
      categoryCount,
    ] = await Promise.all([
      Student.countDocuments(),
      User.countDocuments(),
      Student.countDocuments({ isMember: true }),
      AbvpEvent.countDocuments({ isActive: 1 }),
      Category.countDocuments({ isActive: 1, parentId: null, isDeleted: null }),
      AbvpEventCategory.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        students: studentUserCount,
        users: userCount,
        abvpMemberCouunt: abvpMemberCouunt,
        activeEvents: activeEventCount,
        services: totalEventCount,
        categories: categoryCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

