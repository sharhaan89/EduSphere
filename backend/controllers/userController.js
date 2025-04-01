import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function handleGetUser(req, res) {
    try {
        const userId = req.params.userid;
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No user found." });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
}

export async function handleUserRegister(req, res) {
    try {
        const { email, name, username, roll_number, password } = req.body;

        if (!email || !name || !username || !roll_number || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $2 OR roll_number = $3", 
            [email, username, roll_number]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "User with this email, username, or roll number already exists." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query(
            "INSERT INTO users (email, name, username, roll_number, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email",
            [email, name, username, roll_number, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error. Please try again." });
    }
}

export async function handleUserLogin(req, res) {
    try {
        const { emailOrUsername, password } = req.body;

        const isEmail = emailOrUsername.includes("@");
        const email = isEmail ? emailOrUsername : null;
        const username = isEmail ? null : emailOrUsername;

        if ((!email && !username) || !password) {
            return res.status(400).json({ error: "Email/Username and password are required." });
        }
        
        const userQuery = await pool.query(
            "SELECT * FROM users WHERE email = $1 OR username = $2",
            [email || "", username || ""]
        );

        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const user = userQuery.rows[0];
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign(
            { user_id: user.id, name: user.name, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set the token in an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,  
            secure: true,  
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000  
        });        

        res.status(200).json({ message: "Login successful" });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error. Please try again." });
    }
}