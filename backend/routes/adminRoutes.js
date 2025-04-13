import express from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { handleBanUser, handleUnbanUser } from "../controllers/adminController.js";

const router = express.Router();

router.post("/ban/:id", authenticateUser, handleBanUser);
router.post("/unban/:id", authenticateUser, handleUnbanUser);

export default router;