// controllers/notificationController.js
const pool = require("../db"); // PostgreSQL connection

// ✅ Create & send notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    const result = await pool.query(
      `INSERT INTO notifications (user_id, message, type) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, message, type]
    );

    const notification = result.rows[0];

    // Send realtime socket event
    if (req.io) {
      req.io.to(userId).emit("notification", notification);
    }

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("Error creating notification:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error marking as read:", error.message);
    res.status(500).json({ error: error.message });
  }
};
