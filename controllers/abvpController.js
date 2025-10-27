import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { AboutAbvp, AbvpCollege } from "../models/abvpModel.js";
export const addAboutAbvp = catchAsyncError(async (req, res, next) => {
    try {
        const { description } = req.body;

        // 1️⃣ Validate input
        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }

        // 2️⃣ Check if record already exists (assuming single record)
        let about = await AboutAbvp.findOne();

        // 3️⃣ Update or create
        if (about) {
            about.description = description;
            await about.save();
        } else {
            about = await AboutAbvp.create({ description });
        }

        // 4️⃣ Send response
        res.status(200).json({
            success: true,
            data: about,
            message: about ? "About ABVP updated successfully" : "About ABVP created successfully",
        });
    } catch (error) {
        next(error);
    } 
});


export const getAboutAbvp = catchAsyncError(async (req, res, next) => {

    let data = await AboutAbvp.find();
    res.status(200).json({
        success: true,
        data,
    });
});

export const getAbvpColleges = catchAsyncError(async (req, res, next) => {
    let data = await AbvpCollege.find({isDeleted:null}).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data,
    });
});
export const addAbvpCollege = catchAsyncError(async (req, res, next) => {
    const { state, collegeName, status } = req.body;
    const existingUser = await AbvpCollege.findOne({
        $or: [
            {
                state,
                collegeName
            },
        ],
    });

    if (existingUser) {
        return next(new ErrorHandler("Already Exist.", 400));
    }
    await AbvpCollege.create({ state, collegeName, status });
    res.status(200).json({
        success: true,
        message: 'College added successful!'
    });
});


export const updategAbvpCategoy = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { state, collegeName, status } = req.body;
        let college = await AbvpCollege.findById(id);
        if (!college) {
            return next(new ErrorHandler("College not found", 404));
        }

        if (state !== undefined) college.state = state;
        if (collegeName !== undefined) college.collegeName = collegeName;
        if (status !== undefined) college.status = status;
        await college.save();
        res.status(200).json({
            success: true,
            message: "College updated successfully",
            college,
        });
    } catch (error) {
        next(error);
    }
});


export const deleteAbvpCollege = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        let college = await AbvpCollege.findById(id);
        if (!college) {
            return next(new ErrorHandler("College not found", 404));
        }
        college.isDeleted = 1;
        // if (state !== undefined) college.state = state;
        // if (collegeName !== undefined) college.collegeName = collegeName;
        // if (status !== undefined) college.status = status;
        await college.save();
        res.status(200).json({
            success: true,
            message: "College deleted successfully",
        });
    } catch (error) {
        next(error);
    }
});