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
        required: [true, "State is required"],    // 👈 already required

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
        required: true,
        unique: true,
        trim: true,
    },
    isDeleted: { type: Number, default: 0 },
    isActive: { type: Number, default: 1 },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // optional, if you track who created the event
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
        ref: "EventCategory",   // reference to EventCategory schema
        required: true,
    },
    isDeleted: { type: Number, default: 0 },
    isActive: { type: Number, default: 1 },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // optional, if you track who created the event
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


