const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/logar', login);

module.exports = router;