const pool = require('../db');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload'); // multer setup

// GET user profile
exports.getProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT id, username, email, age, occupation,
              financial_goal AS "financialGoal",
              language, address, contact,
              profile_image AS "profileImage"
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = [
  upload.single('profileImage'),
  async (req, res) => {
    const userId = req.params.id;
    const { username = '', email = '', age, occupation = '', financialGoal = '', language = 'English', address = '', contact = '' } = req.body;

    // Check for duplicate email
    const emailCheck = await pool.query(
      `SELECT id FROM users WHERE email = $1 AND id <> $2`,
      [email, userId]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use by another account." });
    }

    // Parse age
    let parsedAge = null;
    if (age !== undefined && age !== '' && age !== 'null') {
      const numAge = parseInt(age, 10);
      parsedAge = isNaN(numAge) ? null : numAge;
    }

    try {
      // Get old image
      const existingResult = await pool.query(
        `SELECT profile_image FROM users WHERE id = $1`,
        [userId]
      );
      if (existingResult.rows.length === 0)
        return res.status(404).json({ message: 'User not found' });

      const oldImage = existingResult.rows[0].profile_image;
      let profileImagePath = oldImage;

      if (req.file) {
        profileImagePath = `/uploads/${req.file.filename}`;

        if (oldImage && oldImage.startsWith("/uploads/")) {
          const oldPath = path.join(__dirname, '..', oldImage);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      // Update user
      await pool.query(
        `UPDATE users
         SET username = $1,
             email = $2,
             age = $3,
             occupation = $4,
             financial_goal = $5,
             language = $6,
             address = $7,
             contact = $8,
             profile_image = $9
         WHERE id = $10`,
        [username, email, parsedAge, occupation, financialGoal, language, address, contact, profileImagePath, userId]
      );

      // Return updated profile
      const updated = await pool.query(
        `SELECT id, username, email, age, occupation,
                financial_goal AS "financialGoal",
                language, address, contact,
                profile_image AS "profileImage"
         FROM users
         WHERE id = $1`,
        [userId]
      );

      res.json(updated.rows[0]);
    } catch (err) {
      console.error("Error in updateProfile:", err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];
