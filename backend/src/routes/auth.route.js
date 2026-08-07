import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth, fetchGoogleSheetData, login, logout, signup, impersonate, stopImpersonate } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/impersonate/:studentId", protectRoute, impersonate);
router.post("/stop-impersonate", protectRoute, stopImpersonate);

router.get("/check", protectRoute, checkAuth);

router.get("/google", fetchGoogleSheetData);

export default router;
