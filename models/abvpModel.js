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
    isDeleted:{type: Number, default: null},
    createdAt: {
        type: Date,
        default: Date.now,
    },
});



export const AboutAbvp = mongoose.model("about", aboutSchema);
export const AbvpCollege = mongoose.model("abvp-college", abvpCollegeSchema);
