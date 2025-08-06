// server/routes/recoveryRoutes.js
const express = require('express');
const router = express.Router();
const { sendPasswordResetLink } = require('../controllers/recoveryController');

router.post('/', sendPasswordResetLink);

module.exports = router;