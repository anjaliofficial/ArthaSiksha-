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

// UPDATE user profile
exports.updateProfile = [
  upload.single('profileImage'), // multer middleware
  async (req, res) => {
    const userId = req.params.id;
    const {
      username,
      email,
      age,
      occupation,
      financialGoal,
      language,
      address,
      contact
    } = req.body;

    // Convert age to number or null
    let parsedAge = age;
    if (age === "" || age === "null" || age === null) {
      parsedAge = null;
    } else {
      parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge)) parsedAge = null;
    }

    try {
      // Get existing profile to delete old image if replaced
      const existingResult = await pool.query(
        `SELECT profile_image FROM users WHERE id = $1`,
        [userId]
      );

      if (existingResult.rows.length === 0)
        return res.status(404).json({ message: 'User not found' });

      const oldImage = existingResult.rows[0].profile_image;

      // Handle profile image path
      let profileImagePath = oldImage;
      if (req.file) {
        profileImagePath = `/uploads/${req.file.filename}`;

        // Delete old image if exists and is not default
        if (oldImage && oldImage.startsWith("/uploads/")) {
          const oldImagePath = path.join(__dirname, '..', oldImage);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
      }

      // Update user profile
      const result = await pool.query(
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
      const updatedResult = await pool.query(
        `SELECT id, username, email, age, occupation,
                financial_goal AS "financialGoal",
                language, address, contact,
                profile_image AS "profileImage"
         FROM users
         WHERE id = $1`,
        [userId]
      );

      res.json(updatedResult.rows[0]);
    } catch (err) {
      console.error("Error in updateProfile:", err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];
