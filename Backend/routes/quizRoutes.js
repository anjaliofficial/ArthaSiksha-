const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById, createQuiz, editQuiz, deleteQuiz, submitQuiz } = require('../controllers/quizController');
const auth = require("../middleware/authentication");

// Routes
router.get('/getAllQuizzes', auth, getAllQuizzes);
router.get('/GetQuizByID/:id', auth, getQuizById);
router.post('/createQuiz', auth, createQuiz);
router.put('/editQuiz/:id', auth, editQuiz);
router.delete('/deleteQuiz/:id', auth, deleteQuiz);
router.post('/submitQuiz', auth, submitQuiz);

module.exports = router;