import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { AboutAbvp, AbvpCollege, AbvpEvent, AbvpEventCategory } from "../models/abvpModel.js";
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
        await college.save();
        res.status(200).json({
            success: true,
            message: "College deleted successfully",
        });
    } catch (error) {
        next(error);
    }
});


// Event
export const getAllEvetnsList = catchAsyncError(async (req, res, next) => {
    let data = await AbvpEvent.find().populate("category", "categoryName").sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data,
    });
});
export const getEvetnsList = catchAsyncError(async (req, res, next) => {
    let data = await AbvpEvent.find({isActive:1}).populate("category", "categoryName").sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data,
    });
});

export const addAbvpEvent = catchAsyncError(async (req, res, next) => {
    const { category, eventName, status,eventDate } = req.body;
    const existingUser = await AbvpEvent.findOne({
        $or: [
            {
                eventName
            },
        ],
    });

    if (existingUser) {
        return next(new ErrorHandler("Already Exist.", 400));
    }
    await AbvpEvent.create({ category, eventName, status,eventDate });
    res.status(200).json({
        success: true,
        message: 'College added successful!'
    });
});


export const updateAbvpEvent = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { category, eventName, status,eventDate  } = req.body;
        let event = await AbvpEvent.findById(id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        if (category !== undefined) college.category = category;
        if (eventName !== undefined) college.eventName = eventName;
        if (status !== undefined) college.status = status;
        if (eventDate !== undefined) college.status = eventDate;

        await event.save();
        res.status(200).json({
            success: true,
            message: "Event updated successfully",
        });
    } catch (error) {
        next(error);
    }
});

export const getEvetnCategoryList = catchAsyncError(async (req, res, next) => {
    let data = await AbvpEventCategory.find({isActive:1}).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data,
    });
});


export const addAbvpEventCategory = catchAsyncError(async (req, res, next) => {
    const { categoryName, status } = req.body;
    const isActive=status ? 1:0;
    const existingUser = await AbvpEventCategory.find({categoryName:categoryName});
    if (existingUser &&existingUser.length > 0 ) {
        return next(new ErrorHandler("Already Exist.", 400));
    }
    await AbvpEventCategory.create({ categoryName, isActive });
    res.status(200).json({
        success: true,
        message: 'Category added successful!'
    });
});