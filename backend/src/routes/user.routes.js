
import express from "express";
import multer from "multer";

import {
    changePassword,
    details,
    login,
    register,
} from "../controllers/user.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Public routes
router.post("/register", upload.none(), register);
router.post("/login", upload.none(), login);

// Protected routes
router.post("/details", authMiddleware, upload.none(), details);
router.post("/changePassword", authMiddleware, upload.none(), changePassword);

export default router;
