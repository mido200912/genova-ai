const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   GET /api/history
 * @desc    Get user's analysis history
 * @access  Private
 */
router.get('/', authMiddleware, historyController.getHistory);

/**
 * @route   GET /api/history/stats
 * @desc    Get history statistics
 * @access  Private
 */
router.get('/stats', authMiddleware, historyController.getHistoryStats);

/**
 * @route   DELETE /api/history/:id
 * @desc    Delete analysis from history
 * @access  Private
 */
router.delete('/:id', authMiddleware, historyController.deleteAnalysis);

module.exports = router;
