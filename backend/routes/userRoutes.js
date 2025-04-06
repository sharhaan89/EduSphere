import express from "express";
import { authenticateUser, getLoggedInUser } from "../middlewares/auth.js";
import { handleGetUser, handleGetUsersBySearch, handleUserLogin, handleUserLogout, handleUserRegister } from "../controllers/userController.js";

const router = express.Router();

router.get("/search", handleGetUsersBySearch);
router.get("/currentuser", authenticateUser, getLoggedInUser);
router.get("/:userid", handleGetUser);
router.post("/login", handleUserLogin);
router.post("/register", handleUserRegister);   
router.post("/logout", handleUserLogout);

export default router;