const express = require('express');
const router = express.Router();
const { register, login, sendResetLink, resetPasswordWithToken } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', sendResetLink);
router.post('/reset-password', resetPasswordWithToken);

module.exports = router;
