const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
    getAllSections,
    createSection,
    updateSection,
    deleteSection,
    getFeedback,       // New: for fetching all feedback
    submitFeedback,    // New: for submitting feedback
} = require("../controllers/insuranceController");

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensures the uploads/insurance_files directory exists 
        cb(null, 'uploads/insurance_files'); 
    },
    filename: (req, file, cb) => {
        // Use a unique name to prevent collision
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, name + '-' + Date.now() + ext); 
    },
});

const upload = multer({ storage: storage });

// Dedicated Upload Route (POST /api/insurance-sections/upload)
router.post("/upload", upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    // Returns the relative path for the client to use (e.g., uploads/insurance_files/...)
    res.json({ 
        message: "File uploaded successfully.",
        filePath: req.file.path.replace(/\\/g, '/') // Ensure forward slashes for URL paths
    });
});

// --- CONTENT CRUD ROUTES ---

// 1. GET ALL Sections: /api/insurance-sections 
router.get("/", getAllSections);

// 2. CREATE Section: /api/insurance-sections (Handles JSON body)
router.post("/", createSection); 

// 3. UPDATE Section: /api/insurance-sections/:id (Handles JSON body)
router.put("/:id", updateSection); 

// 4. DELETE Section: /api/insurance-sections/:id
router.delete("/:id", deleteSection);

// --- NEW FEEDBACK ROUTES ---

// 5. GET ALL Feedback (Fixes 404): /api/insurance-sections/feedback
router.get("/feedback", getFeedback);

// 6. SUBMIT Feedback: /api/insurance-sections/:id/feedback
router.post("/:id/feedback", submitFeedback);

module.exports = router;
