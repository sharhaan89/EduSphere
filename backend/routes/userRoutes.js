import express from "express";
import { handleUserLogin, handleUserRegister } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", handleUserLogin);
router.post("/register", handleUserRegister);

export default router;