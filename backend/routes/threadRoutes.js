import express from "express";
import { handleGetAllThreads, handleGetThread, handleThreadCreate, handleThreadModify, handleThreadDelete, handleGetThreadsBySearch } from "../controllers/threadController.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/search", handleGetThreadsBySearch);
router.get("/:subforum/all", handleGetAllThreads);
router.get("/:id", handleGetThread);
router.post("/:subforum", authenticateUser, handleThreadCreate);
router.put("/:id", authenticateUser, handleThreadModify);
router.delete("/:id", authenticateUser, handleThreadDelete);

export default router;