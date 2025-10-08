// File: backend/routes/insuranceRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authenticate = require("../middleware/authentication"); 
const { checkAdmin } = require("../middleware/checkAdmin"); // ⚠️ Assuming checkAdmin is exported from authMiddleware.js
const {
    getAllSections,
    createSection,
    updateSection,
    deleteSection,
    getFeedbackBySection, 
    submitFeedback,
    // 🟢 IMPORT NEW ADMIN FUNCTIONS
    getAllFeedback, 
    updateFeedbackStatus, 
} = require("../controllers/insuranceController");

// --- MULTER CONFIGURATION (Unchanged) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/insurance_files'); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, name + '-' + Date.now() + ext); 
    },
});

const upload = multer({ storage: storage });

// Dedicated Upload Route: Admin Only (Protected by authenticate & checkAdmin)
router.post("/upload", authenticate, checkAdmin, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    res.json({ 
        message: "File uploaded successfully.",
        filePath: req.file.path.replace(/\\/g, '/') 
    });
});

// --- CONTENT CRUD ROUTES (Protected by authenticate & checkAdmin) ---
router.get("/", getAllSections); // Public Read Access
router.post("/", authenticate, checkAdmin, createSection); // Admin Only
router.put("/:id", authenticate, checkAdmin, updateSection); // Admin Only
router.delete("/:id", authenticate, checkAdmin, deleteSection); // Admin Only

// --- FEEDBACK ROUTES ---

// User Route: Matches GET /api/insurance-sections/:id/feedback 
router.get("/:id/feedback", getFeedbackBySection); 

// User Route: Matches POST /api/insurance-sections/:id/feedback
router.post("/:id/feedback", authenticate, submitFeedback); 

// 🟢 ADMIN FEEDBACK ROUTES (FIXES 404 ERRORS)

// 1. Route to fetch ALL feedback (Admin Only)
// FIXES: GET http://localhost:3000/api/insurance-sections/feedback 404
router.get("/feedback", authenticate, checkAdmin, getAllFeedback); 

// 2. Route to update feedback status (Admin Only)
// FIXES: PUT http://localhost:3000/api/insurance-sections/feedback/:id 404
router.put("/feedback/:id", authenticate, checkAdmin, updateFeedbackStatus); 

module.exports = router;