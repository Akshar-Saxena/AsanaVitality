import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const accessToken = (username, email) => {
    const token = jwt.sign(
        {
            username: username,
            email: email,
        },
        process.env.SECRET,
        { expiresIn: "24h" }
    );
    return token;
};

export { accessToken };
