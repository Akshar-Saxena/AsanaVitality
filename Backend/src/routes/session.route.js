import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import { profileMiddleware } from "../middlewares/profile.middleware.js";

dotenv.config();
const router = express.Router();

router.get("/id", profileMiddleware, function (req, res) {
    const date = new Date();
    const data = { email: req.body.email, date: date };
    const id = crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex");
    res.json({
        sessionId: id,
    });
});

export default router;
