import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    email: {
        type: String,
    },
    otp: {
        type: Number,
    },
});

const otpModel = mongoose.model("otp", otpSchema);
export default otpModel;
