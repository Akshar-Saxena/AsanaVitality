import mongoose from "mongoose";

const sessionSchema = mongoose.Schema(
    {
        email: {
            type: "String",
            required: true,
        },
        sessionId: {
            type: "String",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const sessionModel = mongoose.model("session", sessionSchema);

export default sessionModel;
