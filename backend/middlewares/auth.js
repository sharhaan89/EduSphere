import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;
const JWT_SECRET = process.env.JWT_SECRET;

export function authenticateUser(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token.", redirect: `${FRONTEND_URL}/user/login` });
    }
}

export function getLoggedInUser(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        res.json({
            userid: req.user.user_id,
            name: req.user.name,
            username: req.user.username,
            email: req.user.email,
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}
