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
router.post('/register', register);    // correct

router.post('/forgot-password', sendResetLink);
router.post('/reset-password', resetPasswordWithToken);

module.exports = router;
