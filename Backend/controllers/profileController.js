// controllers/profileController.js

const pool = require("../db");
const fs = require("fs");
const path = require("path");

// ---------------- GET PROFILE ----------------
const getProfile = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized: Please log in." });
  }

  try {
    const userRes = await pool.query(
      // Change 'profile_pic' to 'profile_image' in the SELECT statement
      "SELECT id, username, email, age, occupation, financial_goal, address, contact, profile_image FROM users WHERE id=$1",
      [req.userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userRes.rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- UPDATE PROFILE ----------------
// controllers/profileController.js

const updateProfile = async (req, res) => {
  try {
    const {
      username,
      email,
      age, // This is the field causing the error
      occupation,
      financial_goal,
      address,
      contact,
    } = req.body;

    // Convert empty string/null-like values to an actual null
    const sanitizedAge = age === "" || age === "null" ? null : parseInt(age);

    let profileImage = req.file ? req.file.filename : null;

    // ... (rest of your file handling logic) ...

    const updatedRes = await pool.query(
      `UPDATE users
       SET username=$1, email=$2, age=$3, occupation=$4, financial_goal=$5, address=$6, contact=$7, profile_image=COALESCE($8, profile_image)
       WHERE id=$9
       RETURNING id, username, email, age, occupation, financial_goal, address, contact, profile_image`,
      // Pass the sanitizedAge here
      [username, email, sanitizedAge, occupation, financial_goal, address, contact, profileImage, req.userId]
    );

    res.status(200).json({ message: "Profile updated", user: updatedRes.rows[0] });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { getProfile, updateProfile };