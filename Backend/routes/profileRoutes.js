const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");
const { getProfile, updateProfile } = require("../controllers/profileController");
const upload = require("../middleware/upload");

// Corrected route to use "profile_image"
router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, upload.single("profile_image"), updateProfile);

module.exports = router;