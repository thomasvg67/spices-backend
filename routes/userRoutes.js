const express = require('express');
const router = express.Router();
const { signup, login, adminLogin } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/admin-login', adminLogin);

module.exports = router;
