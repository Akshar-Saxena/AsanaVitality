import mongoose from "mongoose";

const profileSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatarLink: {
            type: String,
            default: "",
        },
        height: {
            type: Number,
            default: 0,
        },
        weight: {
            type: Number,
            default: 0,
        },
        age: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const profileModel = mongoose.model("profiles", profileSchema);

export default profileModel;
