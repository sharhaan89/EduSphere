import express from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { handleGetAllReplies, handleReplyPostToThread, handleReplyModify, handleReplyDelete } from "../controllers/replyController.js"

const router = express.Router();

router.get("/:threadid", handleGetAllReplies);
router.post("/thread/:threadid", authenticateUser, handleReplyPostToThread);
router.put("/:replyid", authenticateUser, handleReplyModify);
router.delete("/:replyid", authenticateUser, handleReplyDelete);

export default router;