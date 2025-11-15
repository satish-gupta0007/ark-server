import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
    description: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const abvpCollegeSchema = new mongoose.Schema({
    state: {
        type: String,
        required: [true, "State is required"],

    },
    collegeName: {
        type: String,
        required: [true, "College name is required"],
    },
    status: Boolean,
    isDeleted: { type: Number, default: null },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const eventCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: [true, "Category is required"],
    },
    isDeleted: { type: Number, default: 0 },
    isActive: { type: Number, default: 1 },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const padhadhikariSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Fullname is required"],
    },
    designation: {
        type: String,
        required: [true, "Designation is required"],
    },
    qualification: {
        type: String,
        required: [true, "Qualification is required"],
    },
    padhadhikariImage: {
        type: String,
       default: null
    },
    dob: {
        type: String,
        required: [true, "Dob is required"],
    },
    office: {
        type: String,
        required: [true, "Office is required"],
    },
    achivements: {
        type: String,
        required: [true, "achivements is required"],
    },
    mob: {
        type: String,
        required: [true, "Mobile number is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    website: {
        type: String,
        required: [true, "Website is required"],
    },
    education: {
        type: String,
        required: [true, "Education is required"],
    },
    origin: {
        type: String,
        required: [true, "Origin is required"],
    },
    medicalRole: {
        type: String,
        required: [true, "Medical Role is required"],
    },
    abvpStart: {
        type: String,
        default: null
    },
    majorProgram: {
        type: String,
        default: null
    },
    socialImpact: {
        type: String,
        default: null
    },
    abvpRole: {
        type: String,
        default: null
    },
    advocacyFocus: {
        type: String,
        default: null
    },
    whatsapp: {
        type: String,
        default: null
    },
    facebook: {
        type: String,
        default: null
    },
    instagram: {
        type: String,
        default: null
    },
    thread: {
        type: String,
        default: null
    },
    isDeleted: { type: Number, default: 0 },
    isActive: { type: Number, default: 1 },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const abvpEventsSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: [true, "Event name is required"],

    },
    eventDate: {
        type: Date,
        required: [true, "Event date is required"],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventCategory",
        required: true,
    },
    isDeleted: { type: Number, default: 0 },
    isActive: { type: Number, default: 1 },
    eventLocation: { type: String, default: null },
    eventOrgnized: { type: String, default: null },
    eventDescription: { type: String, default: null },
    eventImages: { type: String, default: null },
    bannerImage: { type: String, default: null },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});




export const AboutAbvp = mongoose.model("about", aboutSchema);
export const AbvpCollege = mongoose.model("abvp-college", abvpCollegeSchema);
export const AbvpEvent = mongoose.model("Event", abvpEventsSchema);
export const AbvpEventCategory = mongoose.model("EventCategory", eventCategorySchema);
export const AbvpPadhadhikari = mongoose.model("Padhadhikari", padhadhikariSchema);