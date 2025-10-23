import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
    description: String,

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
    isDeleted:{type: Number, default: null}
});



export const AboutAbvp = mongoose.model("about", aboutSchema);
export const AbvpCollege = mongoose.model("abvp-college", abvpCollegeSchema);
