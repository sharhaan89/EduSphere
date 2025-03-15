import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import voteRouter from "./routes/voteRoutes.js";
import replyRouter from "./routes/replyRoutes.js";
import threadRouter from "./routes/threadRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
    cors({
        origin: FRONTEND_URL, // Adjust based on your frontend
        credentials: true,  // Allows cookies to be sent & received
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/forum/thread", threadRouter);
app.use("/forum/reply", replyRouter);
app.use("/forum/vote", voteRouter);

try {
    app.listen(PORT, () => {
    console.log(`✅ Server running on PORT: ${PORT}`);
    });
} catch (err) {
    console.log("Error in starting the server.");
}