import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { accessToken } from "../constants/accessToken.js";
import otpModel from "../models/otp.model.js";
import profileModel from "../models/profile.model.js";

const signup = async (data) => {
    const results = await userModel.find({ email: data.email });
    const otpRecord = await otpModel.find({ email: data.email });
    if (results.length == 0) {
        // console.log(otpRecord[0].otp);
        console.log(data.otp);
        if (otpRecord[0].otp == data.otp) {
            const user = await userModel({
                username: data.username,
                email: data.email,
                password: bcrypt.hashSync(data.password, 10),
                accessToken: accessToken(data.username, data.email),
            });
            const res = await user.save();
            return {
                accessToken: res.accessToken,
            };
        } else {
            return { message: "Invalid OTP" };
        }
    } else {
        return { message: "User with this email already exists" };
    }
};

const profile = async (data) => {
    const results = await userModel.find({ email: data.email });
    const profile = new profileModel({
        username: results[0].username,
        email: results[0].username,
        password: results[0].password,
        avatarLink: data.avatarLink,
        weight: data.weight,
        height: data.height,
        age: data.age,
    });
    profile.save().then((res) => {
        userModel
            .findOneAndUpdate({ email: data.email }, { profileID: res._id })
            .then((res) => {
                res.json({ message: "Profile Created" });
            });
    });
};

const login = async (data) => {
    const results = await userModel.find({ email: data.email });
    if (results.length > 0) {
        if (bcrypt.compareSync(data.password, results[0].password)) {
            const token = accessToken(results[0].username, data.email);
            const flag = await userModel.findByIdAndUpdate(results[0]._id, {
                accessToken: token,
            });
            return {
                accessToken: token,
                message: "Login successful",
            };
        } else {
            return {
                message: "Invalid Password",
            };
        }
    } else {
        return {
            message: "User do not exists",
        };
    }
};

const profileHandler = async (data) => {
    console.log(data.email);
};

export { signup, login, profileHandler };
