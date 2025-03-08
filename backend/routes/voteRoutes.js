import express from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { handleVote, handleGetVoteCount } from "../controllers/voteController.js";
const router = express.Router();

router.post("/", authenticateUser, handleVote);
router.get("/:contentType/:contentId", handleGetVoteCount);

export default router;
