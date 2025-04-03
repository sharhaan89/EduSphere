import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;
const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticateUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userid = decoded.user_id;

    const result = await pool.query(
      "SELECT banned FROM users WHERE userid = $1",
      [userid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (result.rows[0].banned) {
      return res
        .status(403)
        .json({ message: "You are banned from the platform." });
    }

    req.user = decoded;

    next();
  } catch (err) {
    res
      .status(401)
      .json({
        error: "Invalid or expired token.",
        redirect: `${FRONTEND_URL}/user/login`,
      });
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
