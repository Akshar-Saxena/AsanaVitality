import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const profileMiddleware = (req, res, next) => {
    try {
        const flag = jwt.verify(req.cookies.access_token, process.env.SECRET);
        if (flag) {
            req.body = {
                ...req.body,
                email: flag.email,
            };
            next();
        }
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export { profileMiddleware };
