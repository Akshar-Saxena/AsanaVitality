import express from "express";
import dotenv from "dotenv";
import { profileMiddleware } from "../middlewares/profile.middleware.js";
import recordModel from "../models/records.model.js";

dotenv.config();

const router = express.Router();

router.post("/editRecords", profileMiddleware, async (req, res) => {
    const { email, record } = req.body;
    const results = await recordModel.find({ email: email });
    if (results.length > 0) {
        recordModel
            .findOneAndUpdate(
                {
                    email: email,
                },
                { records: [...results[0].records, record] },
                { new: true }
            )
            .then(() => {
                res.json({ message: "Record updated successfully" });
            })
            .catch((err) => {
                res.status(400).json({ message: "Error updating record" });
            });
    } else {
        const newRecord = await recordModel({
            email: email,
            records: record,
        });
        newRecord
            .save()
            .then(() => {
                res.json({ message: "Record made successfully" });
            })
            .catch((err) => {
                res.status(400).json({ message: "Error making record" });
            });
    }
});

export default router;
