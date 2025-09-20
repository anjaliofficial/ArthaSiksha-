// controllers/profileController.js

const pool = require("../db");
const fs = require("fs");
const path = require("path");

// ---------------- GET PROFILE ----------------
const getProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: Please log in." });
  }

  try {
    const userRes = await pool.query(
      // Change 'profile_pic' to 'profile_image' in the SELECT statement
      "SELECT id, username, email, age, occupation, financial_goal, address, contact, profile_image FROM users WHERE id=$1",
      [req.user.id]
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
      age,
      occupation,
      financial_goal,
      address,
      contact,
    } = req.body;

    const sanitizedAge = age === "" || age === "null" ? null : age !== undefined ? parseInt(age) : undefined;

    const profileImage = req.file ? req.file.filename : undefined;

    // Build dynamic query
    const fields = [];
    const values = [];
    let idx = 1;

    if (username !== undefined) { fields.push(`username=$${idx++}`); values.push(username); }
    if (email !== undefined) { fields.push(`email=$${idx++}`); values.push(email); }
    if (sanitizedAge !== undefined) { fields.push(`age=$${idx++}`); values.push(sanitizedAge); }
    if (occupation !== undefined) { fields.push(`occupation=$${idx++}`); values.push(occupation); }
    if (financial_goal !== undefined) { fields.push(`financial_goal=$${idx++}`); values.push(financial_goal); }
    if (address !== undefined) { fields.push(`address=$${idx++}`); values.push(address); }
    if (contact !== undefined) { fields.push(`contact=$${idx++}`); values.push(contact); }
    if (profileImage !== undefined) { fields.push(`profile_image=COALESCE($${idx++}, profile_image)`); values.push(profileImage); }

    values.push(req.user.id);

    const updatedRes = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *`,
      values
    );

    res.status(200).json({ message: "Profile updated", user: updatedRes.rows[0] });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile, updateProfile };