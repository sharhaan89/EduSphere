import express from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { handleGetAllReplies, handleGetReply, handleReplyPostToThread, handleReplyModify, handleReplyDelete, handleGetRepliesBySearch } from "../controllers/replyController.js"

const router = express.Router();

router.get("/search", handleGetRepliesBySearch)
router.get("/:threadid", handleGetAllReplies);
router.get("/getreply/:replyid", handleGetReply);
router.post("/thread/:threadid", authenticateUser, handleReplyPostToThread);
router.put("/:replyid", authenticateUser, handleReplyModify);
router.delete("/:replyid", authenticateUser, handleReplyDelete);

export default router;