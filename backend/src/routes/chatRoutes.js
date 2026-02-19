const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected chat route (only logged in users for now)
router.post('/', authMiddleware, chatController.sendMessage);

module.exports = router;
