const pool = require("../db");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, email FROM users");
        res.json({ users: result.rows }); // use result.rows
    } catch (err) {
        console.error("Error fetching users: ", err);
        res.status(500).json({ message: "Error fetching users" });
    }
};

const getUserById = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, username, email FROM users WHERE id = $1", 
            [req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ message: "User not found" });
        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error("Error fetching user: ", err);
        res.status(500).json({ message: "Error fetching user" });
    }
};

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
};

const editUser = async (req, res) => {
    const { username, email } = req.body;
    try {
        await pool.query(
            "UPDATE users SET username=$1, email=$2 WHERE id=$3",
            [username, email, req.params.id]
        );
        res.json({ message: "User updated successfully" });
    } catch (err) {
        console.error("Error updating user: ", err);
        res.status(500).json({ message: "Error updating user" });
    }
};

const deleteUser = async (req, res) => {
    try {
        await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user: ", err);
        res.status(500).json({ message: "Error deleting user" });
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    editUser,
    deleteUser
};