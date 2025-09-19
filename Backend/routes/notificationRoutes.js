// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markAsRead,
} = require("../controllers/notificationController");

router.post("/", createNotification);          // FIXED: added missing comma
router.get("/:userId", getUserNotifications);
router.put("/:id/read", markAsRead);

module.exports = router;
