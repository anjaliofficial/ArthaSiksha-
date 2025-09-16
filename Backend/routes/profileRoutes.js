const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// GET user profile
router.get('/:id', profileController.getProfile);

// UPDATE user profile
router.put('/:id', profileController.updateProfile);

module.exports = router;
