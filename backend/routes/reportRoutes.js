import express from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { handleReportCreate, handleGetAllReports, handleGetReport, handleUpdateReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", authenticateUser, handleReportCreate);
router.put("/:id", authenticateUser, handleUpdateReport);
router.get("/:id", authenticateUser, handleGetReport);
router.get("/", authenticateUser, handleGetAllReports);

export default router;