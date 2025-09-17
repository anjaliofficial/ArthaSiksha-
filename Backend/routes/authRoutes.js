const express = require('express');
const router = express.Router();
const {
  register,
  login,
  sendResetLink,
  resetPasswordWithToken
} = require('../controllers/authController');

// ✅ Only use relative paths here, NOT full URLs
router.post('/login', login);          // correct
router.post('/register', register); // available at /api/auth/register

router.post('/forgot-password', sendResetLink);
router.post('/reset-password', resetPasswordWithToken);

module.exports = router;
