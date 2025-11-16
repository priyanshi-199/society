const express = require('express');
const { chatWithBot } = require('../controllers/chatbotController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/chat', authenticate, chatWithBot);

module.exports = router;

