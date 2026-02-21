const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { authenticate } = require('../middleware/auth_middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/login/user', authController.loginUser);
router.post('/login/admin', authController.loginAdmin);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
