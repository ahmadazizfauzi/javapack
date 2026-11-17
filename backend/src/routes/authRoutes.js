const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.get('/me', authMiddleware, AuthController.getMe);
router.put('/me', authMiddleware, AuthController.updateMe);

module.exports = router;
