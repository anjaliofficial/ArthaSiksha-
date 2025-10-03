const pool = require("../db"); // PostgreSQL pool connection

// Get all sections 
const getAllSections = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM insurance_sections ORDER BY id ASC");
        res.json(result.rows); 
    } catch (err) {
        console.error("Error fetching all insurance sections:", err);
        res.status(500).json({ error: "Server error during fetch" }); 
    }
};

// Create a new section (admin)
const createSection = async (req, res) => {
    const { title, content } = req.body; 

    try {
        const result = await pool.query(
            "INSERT INTO insurance_sections (title, content) VALUES ($1, $2) RETURNING *",
            [title, content] 
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating insurance section:", err);
        res.status(500).json({ error: "Server error during creation" });
    }
};

// Update a section (admin)
const updateSection = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    
    try {
        const result = await pool.query(
            "UPDATE insurance_sections SET title=$1, content=$2, updated_at=NOW() WHERE id=$3 RETURNING *",
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

// Delete a section (admin)
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

// --- NEW FEEDBACK CONTROLLERS ---

/**
 * Retrieves all feedback and calculates the average rating per section.
 * The result is structured as { [sectionId]: { comments: [], avgRating: X } }
 */
const getFeedback = async (req, res) => {
    try {
        // Fetch all feedback records
        const result = await pool.query("SELECT section_id, rating, comment, created_at FROM insurance_feedback ORDER BY created_at DESC");
        
        const feedbackMap = {};
        
        result.rows.forEach(row => {
            // Convert section_id to string to match JavaScript object key type (optional but good practice)
            const sectionId = row.section_id.toString(); 
            
            if (!feedbackMap[sectionId]) {
                feedbackMap[sectionId] = {
                    comments: [],
                    totalRating: 0,
                    count: 0
                };
            }
            
            feedbackMap[sectionId].comments.push({
                rating: row.rating,
                comment: row.comment,
                created_at: row.created_at
            });
            feedbackMap[sectionId].totalRating += row.rating;
            feedbackMap[sectionId].count += 1;
        });

        // Calculate average rating
        const finalFeedback = {};
        for (const id in feedbackMap) {
            finalFeedback[id] = {
                comments: feedbackMap[id].comments,
                // Ensure floating point arithmetic for average
                avgRating: feedbackMap[id].totalRating / feedbackMap[id].count 
            };
        }

        res.json(finalFeedback);
    } catch (err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({ error: "Server error during feedback fetch" });
    }
};

/**
 * Submits new feedback for a specific section.
 */
const submitFeedback = async (req, res) => {
    // Note: id is the section ID
    const { id } = req.params; 
    const { rating, comment } = req.body;
    
    // Simple validation
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO insurance_feedback (section_id, rating, comment) VALUES ($1, $2, $3) RETURNING *",
            [id, rating, comment || null] // Comment is optional
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error submitting feedback:", err);
        res.status(500).json({ error: "Server error during feedback submission" });
    }
};

module.exports = {
    getAllSections,
    createSection,
    updateSection,
    deleteSection,
    getFeedback, 
    submitFeedback,
};
