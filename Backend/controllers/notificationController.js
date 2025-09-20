const pool = require('../db');

// Send notification to all users
const sendNotificationToAllUsers = async (message, type, io) => {
  try {
    const users = await pool.query('SELECT id FROM users');

    const insertPromises = users.rows.map(user =>
      pool.query(
        'INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3) RETURNING *',
        [user.id, message, type]
      )
    );

    const notifications = await Promise.all(insertPromises);

    // Emit to each user via socket.io
    notifications.forEach((notif) => {
      io.to(notif[0].user_id.toString()).emit('new_notification', notif[0]);
    });

  } catch (err) {
    console.error('Error sending notifications:', err);
  }
};

// Get notifications for a user + unread count
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notificationsRes = await pool.query(
      'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC',
      [userId]
    );

    const unreadRes = await pool.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id=$1 AND is_read=false',
      [userId]
    );

    res.status(200).json({
      notifications: notificationsRes.rows,
      unreadCount: parseInt(unreadRes.rows[0].count, 10)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await pool.query(
      'UPDATE notifications SET is_read=true, updated_at=NOW() WHERE id=$1 RETURNING *',
      [id]
    );

    if (!updated.rows.length) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', notification: updated.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendNotificationToAllUsers,
  getUserNotifications,
  markAsRead
};
