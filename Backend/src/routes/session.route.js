import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import { profileMiddleware } from "../middlewares/profile.middleware.js";
import sessionModel from "../models/session.model.js";

dotenv.config();
const router = express.Router();

router.get("/id", profileMiddleware, async function (req, res) {
    const date = new Date();
    const data = { email: req.body.email, date: date };
    const id = crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex");
    const newSession = await sessionModel({
        email: req.body.email,
        sessionId: id,
    });
    newSession
        .save()
        .then(() => {
            res.json({
                sessionId: id,
            });
        })
        .catch((e) => {
            res.status(404).json({ message: "Error saving session" });
        });
});

router.post("/verifySession", profileMiddleware, async function (req, res) {
    const results = await sessionModel.find({ email: req.body.email });
    if (results.length > 0) {
        if (results[0].sessionId == req.body.sessionId) {
            res.json({ message: "Session verified" });
        } else {
            res.status(404).json({ message: "Session not found" });
        }
    } else {
        res.status(404).json({ message: "Session not found" });
    }
});

router.post("/deleteSession", profileMiddleware, async function (req, res) {
    sessionModel
        .findOneAndDelete({
            email: req.body.email,
            sessionId: req.body.sessionId,
        })
        .then((deletedSession) => {
            if (!deletedSession) {
                res.status(500).json({ message: "Error deleting session" });
            } else {
                res.json({ message: "Session deleted" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Session not found" });
        });
});

export default router;
