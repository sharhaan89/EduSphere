import express from "express";
import { handleGetUser, handleUserLogin, handleUserRegister } from "../controllers/userController.js";

const router = express.Router();

router.get("/:userid", handleGetUser);
router.post("/login", handleUserLogin);
router.post("/register", handleUserRegister);

export default router;