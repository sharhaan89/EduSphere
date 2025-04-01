import express from "express";
import { authenticateUser, getLoggedInUser } from "../middlewares/auth.js";
import { handleGetUser, handleUserLogin, handleUserRegister } from "../controllers/userController.js";

const router = express.Router();

router.get("/currentuser", authenticateUser, getLoggedInUser);
router.get("/:userid", handleGetUser);
router.post("/login", handleUserLogin);
router.post("/register", handleUserRegister);

export default router;