import express from "express";
import {
    login,
    profileHandler,
    signup,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import generateOTP from "../constants/generateOTP.js";
import content from "../constants/content.js";
import otpModel from "../models/otp.model.js";
import { profileMiddleware } from "../middlewares/profile.middleware.js";
import userModel from "../models/user.model.js";
import profileModel from "../models/profile.model.js";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.PASS,
    },
});

router.post("/signup", async function (req, res) {
    const data = req.body;
    const response = await signup(data);
    try {
        if (response.accessToken) {
            res.cookie("access_token", response.accessToken, {
                httpOnly: true,
                secure: true,
            });
            res.json({ message: "Account Created Successfully" });
        } else {
            res.status(400).json(response);
        }
    } catch (e) {
        res.status(400).json(response);
    }
});

router.post("/login", async function (req, res) {
    const data = req.body;
    const response = await login(data);
    // try {
    //     if (response.accessToken) {
    //         res.cookie("access_token", response.accessToken, {
    //             httpOnly: true,
    //             secure: true,
    //         });
    //     }
    // } catch (error) {
    //     null;
    // }
    if (Object.entries(response).length > 1) {
        res.cookie("access_token", response.accessToken, {
            httpOnly: true,
            // secure: true,
        }).json({ message: "Login Successful" });
    } else {
        res.status(400).json(response);
    }
});

router.get("/info", authMiddleware, function (req, res) {
    res.json({
        message: "Welcome",
    });
});

router.get("/logout", authMiddleware, async function (req, res) {
    res.clearCookie("access_token");
    res.json({
        message: "Logout",
    });
});

router.get("/verify", authMiddleware, async function (req, res) {
    res.json({ message: "Verified Profile", flag: 1 });
});

router.post("/profile", profileMiddleware, async function (req, res) {
    const user = await userModel.find({ email: req.body.email });
    if (user.length > 0) {
        const profile = new profileModel({
            username: user[0].username,
            email: user[0].email,
            password: user[0].password,
            avatarLink: "",
            weight: 0,
            height: 0,
            age: 0,
        });
        profile
            .save()
            .then((response1) => {
                userModel
                    .findOneAndUpdate(
                        { email: user[0].email },
                        { profile: res._id },
                        { new: true }
                    )
                    .then((response2) => {
                        res.json({ message: "Profile Created" });
                    })
                    .catch((err) => {
                        // res.status(400).json({ message: "Error Occured" });
                        console.log(err);
                        null;
                    });
            })
            .catch((err) => {
                console.log(err);
                res.json({ message: err });
            });
    }
});

router.get("/getProfile", profileMiddleware, async function (req, res) {
    const profile = await profileModel.find({ email: req.body.email });
    if (profile.length > 0) {
        res.json({
            email: profile[0].email,
            username: profile[0].username,
            weight: profile[0].weight,
            height: profile[0].height,
            age: profile[0].age,
            avatarLink: profile[0].avatarLink,
        });
    } else {
        res.status(400).json({ message: "Profile do no exists" });
    }
});

router.post("/editProfile", profileMiddleware, async function (req, res) {
    const profile = await profileModel.find({ email: req.body.email });
    if (profile.length > 0) {
        profileModel
            .findOneAndUpdate(
                {
                    email: profile[0].email,
                },
                {
                    avatarLink: req.body.avatarLink,
                    height: req.body.height,
                    weight: req.body.weight,
                    age: req.body.age,
                },
                {
                    new: true,
                }
            )
            .then((r) => {
                res.json({ message: "Profile updated" });
            })
            .catch((err) => {
                res.status(400).json({ message: "Error updating profile" });
            });
    }
});

router.post("/sendOtp", async function (req, res) {
    const { email, username } = req.body;
    const otpGenerate = generateOTP();
    const { subject, body } = content(otpGenerate, username);
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: subject,
        html: body,
    };
    const otpRecords = await otpModel.find({ email: email });
    if (otpRecords.length > 0) {
        const changeOtp = await otpModel.findOneAndUpdate(
            { email: email },
            { otp: otpGenerate },
            { new: true }
        );
    } else {
        const otp = new otpModel({
            email: email,
            otp: otpGenerate,
        });
        otp.save();
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error occurred:", error);
        } else {
            res.json({ message: "Sent Successfully" });
        }
    });
});

export default router;
