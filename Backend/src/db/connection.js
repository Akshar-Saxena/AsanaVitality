import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then((res) => {
        console.log("Db connection established");
    })
    .catch((err) => {
        console.log("Error connecting");
    });
