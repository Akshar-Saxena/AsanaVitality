import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        const flag = jwt.verify(req.cookies.access_token, process.env.SECRET);
        if (flag) {
            next();
        }
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export { authMiddleware };
