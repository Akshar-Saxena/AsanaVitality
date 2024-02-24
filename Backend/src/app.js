import "./db/connection.js";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import sessionRoutes from "./routes/session.route.js";
import recordsRoutes from "./routes/records.route.js";

dotenv.config();

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", [
        "http://localhost:5173",
        "https://asana-vitality.vercel.app",
    ]); // Set the origin to your frontend domain
    res.header("Access-Control-Allow-Credentials", true); // Allow credentials (cookies, authorization headers, etc.)
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.use(
    cors({
        origin: ["http://localhost:5173", "https://asana-vitality.vercel.app"],
        credentials: true,
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/records", recordsRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port " + process.env.PORT);
});
