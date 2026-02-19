const openRouterService = require('../services/openRouterService');
const { validationResult } = require('express-validator');

exports.sendMessage = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const aiResponse = await openRouterService.chat(message, history || []);

        res.json({
            success: true,
            response: aiResponse
        });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process chat message',
            error: error.message
        });
    }
};
