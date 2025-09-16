const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authentication');

router.get('/:id', authMiddleware, profileController.getProfile);
router.put('/:id', authMiddleware, profileController.updatePrfoile);

module.exports = router;