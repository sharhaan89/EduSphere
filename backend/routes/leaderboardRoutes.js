import express from "express";
import { handleGetWeeklyLeaderboard, handleGetLifetimeLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/weekly", handleGetWeeklyLeaderboard);
router.get("/lifetime", handleGetLifetimeLeaderboard);

export default router;