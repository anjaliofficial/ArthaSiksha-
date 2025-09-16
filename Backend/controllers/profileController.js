const pool = require('../db');

// GET user profile
exports.getProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(
            `SELECT id, username, email, age, occupation, financial_goal, address, contact
             FROM users
             WHERE id = $1`,
            [userId]
        );

        const rows = result.rows;

        if (rows.length === 0)
            return res.status(404).json({ message: 'User not found' });

        res.json(rows[0]);
    } catch (err) {
        console.error("Error in getProfile:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// UPDATE user profile
exports.updateProfile = async (req, res) => {
    const userId = req.params.id;
    const { username, email, age, occupation, financial_goal, address, contact } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users
             SET username = $1,
                 email = $2,
                 age = $3,
                 occupation = $4,
                 financial_goal = $5,
                 address = $6,
                 contact = $7
             WHERE id = $8`,
            [username, email, age, occupation, financial_goal, address, contact, userId]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ message: 'User not found' });

        const updatedResult = await pool.query(
            `SELECT id, username, email, age, occupation, financial_goal, address, contact
             FROM users
             WHERE id = $1`,
            [userId]
        );

        res.json(updatedResult.rows[0]);
    } catch (err) {
        console.error("Error in updateProfile:", err);
        res.status(500).json({ message: 'Server error' });
    }
};
