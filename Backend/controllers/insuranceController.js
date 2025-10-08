// File: backend/controllers/insuranceController.js

const pool = require("../db"); // Assuming your database connection setup

// --- CONTENT CRUD CONTROLLERS (Unchanged) ---
const getAllSections = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, title, content, updated_at FROM insurance_sections ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching all insurance sections:", err);
        res.status(500).json({ error: "Server error during fetch" });
    }
};

const createSection = async (req, res) => {
    const { title, content } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO insurance_sections (title, content, updated_at) VALUES ($1, $2, NOW()) RETURNING id, title, content, updated_at",
            [title, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating insurance section:", err);
        res.status(500).json({ error: "Server error during creation" });
    }
};

const updateSection = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const result = await pool.query(
            "UPDATE insurance_sections SET title=$1, content=$2, updated_at=NOW() WHERE id=$3 RETURNING id, title, content, updated_at",
            [title, content, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Section not found." });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating insurance section:", err);
        res.status(500).json({ error: "Server error during update" });
    }
};

const deleteSection = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM insurance_sections WHERE id=$1", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Section not found to delete." });
        }
        res.json({ message: "Section deleted successfully" });
    } catch (err) {
        console.error("Error deleting insurance section:", err);
        res.status(500).json({ error: "Server error during deletion" });
    }
};

// --- FEEDBACK CONTROLLERS ---

const getFeedbackBySection = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Section ID required." });

    try {
        const result = await pool.query(
            "SELECT rating, comment, created_at FROM insurance_feedback WHERE section_id = $1 ORDER BY created_at DESC",
            [id]
        );

        if (result.rows.length === 0) {
            return res.json({ comments: [], avgRating: 0 });
        }

        const totalRating = result.rows.reduce((sum, row) => sum + row.rating, 0);

        const responseData = {
            comments: result.rows,
            avgRating: parseFloat((totalRating / result.rows.length).toFixed(1))
        };

        res.json(responseData);
    } catch (err) {
        console.error(`Error fetching feedback for section ${id}:`, err);
        res.status(500).json({ error: "Server error during feedback fetch" });
    }
};

const submitFeedback = async (req, res) => {
    const { id } = req.params;
    const { rating, comment, name, email } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    try {
        // Use $4 and $5 for name and email, allowing null if not provided
        const result = await pool.query(
            "INSERT INTO insurance_feedback (section_id, rating, comment, name, email, status) VALUES ($1, $2, $3, $4, $5, 'New') RETURNING *",
            [id, rating, comment || null, name || null, email || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error submitting feedback:", err);
        res.status(500).json({ error: "Server error during feedback submission" });
    }
};

/**
 * Retrieves ALL feedback items. (Admin Only)
 * 🟢 CRITICAL: Maps results to handle empty string issues from DB
 */
const getAllFeedback = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, section_id, rating, comment, created_at, status, name, email FROM insurance_feedback ORDER BY created_at DESC"
        );

        // Map the results: If name or email is an empty string (''), convert it to null.
        // This ensures the frontend's robust logic (getFeedbackUserName) works reliably.
        const feedbackList = result.rows.map(row => ({
            ...row,
            name: (row.name === null || row.name.trim() === '') ? null : row.name,
            email: (row.email === null || row.email.trim() === '') ? null : row.email,
        }));

        res.json(feedbackList);
    } catch (err) {
        console.error("Error fetching all feedback for admin:", err);
        res.status(500).json({ error: "Server error retrieving all feedback" });
    }
};

const updateFeedbackStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status field is required." });
    }

    try {
        const result = await pool.query(
            "UPDATE insurance_feedback SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Feedback item not found." });
        }
        res.json({ message: "Status updated successfully", feedback: result.rows[0] });
    } catch (err) {
        console.error(`Error updating feedback status for ID ${id}:`, err);
        res.status(500).json({ error: "Server error updating feedback status" });
    }
};


module.exports = {
    getAllSections,
    createSection,
    updateSection,
    deleteSection,
    getFeedbackBySection,
    submitFeedback,
    getAllFeedback,
    updateFeedbackStatus,
};