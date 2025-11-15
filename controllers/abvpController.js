import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { AboutAbvp, AbvpCollege, AbvpEvent, AbvpEventCategory, AbvpPadhadhikari } from "../models/abvpModel.js";
export const addAboutAbvp = catchAsyncError(async (req, res, next) => {
    try {
        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }
        let about = await AboutAbvp.findOne();
        if (about) {
            about.description = description;
            await about.save();
        } else {
            about = await AboutAbvp.create({ description });
        }
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
    let data = await AbvpCollege.find({ isDeleted: null }).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data,
    });
});
export const getActiveAbvpColleges = catchAsyncError(async (req, res, next) => {
    const groupedColleges = await AbvpCollege.aggregate([
        {
            $match: {
                isDeleted: { $in: [null, false] },
                status: true
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: "$state",
                colleges: { $push: "$$ROOT" }
            }
        },
        {
            $project: {
                _id: 0,
                state: "$_id",
                colleges: 1
            }
        }
    ]);
    res.status(200).json({
        success: true,
        groupedColleges,
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

    try {
        let data = await AbvpEvent.find({ isActive: 1 }).populate("category", "categoryName").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }

});

export const getEventDetails = catchAsyncError(async (req, res, next) => {

    try {
        const { id } = req.params;
        let data = await AbvpEvent.findById(id);
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }

});


export const getEventByCategoryGroup = catchAsyncError(async (req, res, next) => {
    try {
        const groupedEvents = await AbvpEvent.aggregate([
            {
                $match: { isActive: 1 }
            },
            {
                $lookup: {
                    from: 'eventcategories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$category._id',
                    categoryName: { $first: '$category.categoryName' },
                    events: { $push: '$$ROOT' }
                }
            },
            {
                $project: {
                    _id: 0,
                    categoryId: '$_id',
                    categoryName: 1,
                    events: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            groupedEvents,
        });
    } catch (error) {
        next(error);
    }

})

export const addAbvpEvent = catchAsyncError(async (req, res, next) => {
    const { category, eventName, status, eventDate } = req.body;
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
    await AbvpEvent.create({ category, eventName, status, eventDate });
    res.status(200).json({
        success: true,
        message: 'College added successful!'
    });
});


export const updateAbvpEvent = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { category, eventName, bannerImage, status, eventDescription, eventOrgnized, eventLocation, eventImages, eventDate } = req.body;
        let event = await AbvpEvent.findById(id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }
        if (category !== undefined) event.category = category;
        if (eventName !== undefined) event.eventName = eventName;
        if (status !== undefined) event.isActive = status ? 1 : 0;
        if (eventDate !== undefined) event.eventDate = eventDate;
        if (eventLocation !== undefined) event.eventLocation = eventLocation;
        if (eventOrgnized !== undefined) event.eventOrgnized = eventOrgnized;
        if (eventDescription !== undefined) event.eventDescription = eventDescription;
        if (eventImages !== undefined) event.eventImages = eventImages;
        if (bannerImage !== undefined) event.bannerImage = bannerImage;


        await event.save();
        res.status(200).json({
            success: true,
            message: "Event updated successfully",
        });
    } catch (error) {
        next(error);
    }
});
export const updateAbvpEventDetails = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { eventDescription, eventOrgnized, eventLocation, eventDate } = req.body;
        let event = await AbvpEvent.findById(id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }
        if (eventLocation !== undefined) event.eventLocation = eventLocation;
        if (eventOrgnized !== undefined) event.eventOrgnized = eventOrgnized;
        if (eventDescription !== undefined) event.eventDescription = eventDescription;
        if (eventDate !== undefined) event.eventDate = eventDate;
        await event.save();
        res.status(200).json({
            success: true,
            message: "Event updated successfully",
        });
    } catch (error) {
        next(error);
    }
});

export const getEvetnCategoryAllList = catchAsyncError(async (req, res, next) => {
    try {
        let data = await AbvpEventCategory.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }

});

export const getEvetnCategoryList = catchAsyncError(async (req, res, next) => {
    try {
        let data = await AbvpEventCategory.find({ isActive: 1 }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }

});


export const addAbvpEventCategory = catchAsyncError(async (req, res, next) => {
    try {
        const { categoryName, status } = req.body;
        if (!categoryName || !categoryName.trim()) {
            return next(new ErrorHandler("Category name is required", 400));
        }
        const name = categoryName.trim().toLowerCase();
        const isActive = status ? 1 : 0;
        const existingCategory = await AbvpEventCategory.findOne({ name });
        if (existingCategory) {
            return next(new ErrorHandler("Category already exists.", 400));
        }

        await AbvpEventCategory.create({ categoryName, isActive });
        res.status(200).json({
            success: true,
            message: 'Category added successfully!'
        });
    } catch (error) {
        next(error);
    }
});

export const updateAbvpEventCategory = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { categoryName, status } = req.body;
        const isActive = status ? 1 : 0;
        let event = await AbvpEventCategory.findById(id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }
        if (categoryName !== undefined) event.categoryName = categoryName;
        let isExist = await AbvpEventCategory.findOne({ categoryName: categoryName });
        if (isExist && categoryName !== isExist.categoryName) {
            return next(new ErrorHandler("Category name cannot be duplicate", 404));
        }
        if (categoryName !== undefined) event.categoryName = categoryName;
        if (isActive !== undefined) event.isActive = isActive;
        await event.save();
        res.status(200).json({
            success: true,
            message: "Event Category updated successfully",
        });
    } catch (error) {
        next(error);
    }
})


//padhadhikari
export const addAbvpPadhadhikariDetails = catchAsyncError(async (req, res, next) => {
    try {
        const padhadhikariDetails = req.body;
         const isExistPadhadhikari = await AbvpPadhadhikari.find({ email: padhadhikariDetails.email });
        if (isExistPadhadhikari) {
            return next(new ErrorHandler("Email id already exist.", 404));
        }
        await AbvpPadhadhikari.create(padhadhikariDetails);
        res.status(200).json({
            success: true,
            message: 'Category added successfully!'
        });
    } catch (error) {
        next(error);
    }
});

export const getPadhadhikariActiveList = catchAsyncError(async (req, res, next) => {
    try {
        let data = await AbvpPadhadhikari.find({ isActive: 1, isDeleted: 0 }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
});

export const getPadhadhikariList = catchAsyncError(async (req, res, next) => {
    try {
        let data = await AbvpPadhadhikari.find({ isDeleted: 0 }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
});

export const deletePadhadhikari = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        let padhadhikari = await AbvpPadhadhikari.findById(id);
        if (!padhadhikari) {
            return next(new ErrorHandler("Padhadhikari not found", 404));
        }
        padhadhikari.isDeleted = 1;
        await padhadhikari.save();
        res.status(200).json({
            success: true
        });
    } catch (error) {
        next(error);
    }
});

export const updatePadhadhikariStatus = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        let padhadhikari = await AbvpPadhadhikari.findById(id);
        if (!padhadhikari) {
            return next(new ErrorHandler("Padhadhikari not found", 404));
        }
        padhadhikari.isActive = isActive;
        await padhadhikari.save();
        res.status(200).json({
            success: true,
            message: 'Status updated successful!'
        });
    } catch (error) {
        next(error);
    }
});

export const updateAbvpPadhadhikari = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { fullName, designation, qualification, dob, office, achivements, mob, email, website, education, origin,
            medicalRole, abvpStart, majorProgram, socialImpact, abvpRole, advocacyFocus, status, whatsapp, facebook, instagram, thread } = req.body;
        const isActive = status ? 1 : 0;
        let padhadhikari = await AbvpPadhadhikari.findById(id);
        if (!padhadhikari) {
            return next(new ErrorHandler("Padhadhikari not found", 404));
        }
        if (fullName !== undefined) padhadhikari.fullName = fullName;
        if (designation !== undefined) padhadhikari.designation = designation;
        if (qualification !== undefined) padhadhikari.qualification = qualification;
        if (dob !== undefined) padhadhikari.dob = dob;
        if (office !== undefined) padhadhikari.office = office;
        if (achivements !== undefined) padhadhikari.achivements = achivements;
        if (mob !== undefined) padhadhikari.mob = mob;
        if (email !== undefined) padhadhikari.email = email;
        if (website !== undefined) padhadhikari.website = website;
        if (education !== undefined) padhadhikari.education = education;
        if (origin !== undefined) padhadhikari.origin = origin;
        if (medicalRole !== undefined) padhadhikari.medicalRole = medicalRole;
        if (abvpStart !== undefined) padhadhikari.abvpStart = abvpStart;
        if (majorProgram !== undefined) padhadhikari.majorProgram = majorProgram;
        if (socialImpact !== undefined) padhadhikari.socialImpact = socialImpact;
        if (abvpRole !== undefined) padhadhikari.abvpRole = abvpRole;
        if (advocacyFocus !== undefined) padhadhikari.advocacyFocus = advocacyFocus;
        if (whatsapp !== undefined) padhadhikari.whatsapp = whatsapp;
        if (facebook !== undefined) padhadhikari.facebook = facebook;
        if (instagram !== undefined) padhadhikari.instagram = instagram;
        if (thread !== undefined) padhadhikari.thread = thread;
        if (isActive !== undefined && status !== undefined) padhadhikari.isActive = isActive;
        await padhadhikari.save();
        res.status(200).json({
            success: true,
            message: "Padhadhikari updated successfully",
        });
    } catch (error) {
        next(error);
    }
})

export const getPadhadhikariDetails = catchAsyncError(async (req, res, next) => {
    try {
        const {id}=req.params;
        let data = await AbvpPadhadhikari.findOne({ isActive: 1,_id:id});
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
});