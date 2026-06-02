const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getAllUsers, googleLogin } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.get('/me', protect, getMe);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
