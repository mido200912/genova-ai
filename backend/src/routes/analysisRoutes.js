const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const analysisController = require('../controllers/analysisController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   POST /api/analysis
 * @desc    Analyze symptoms using AI
 * @access  Private
 */
router.post(
    '/',
    authMiddleware,
    [
        body('symptoms')
            .trim()
            .notEmpty()
            .withMessage('Symptoms description is required')
            .isLength({ min: 10, max: 2000 })
            .withMessage('Symptoms description must be between 10 and 2000 characters'),
    ],
    analysisController.analyzeSymptoms
);

/**
 * @route   GET /api/analysis/:id
 * @desc    Get single analysis by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, analysisController.getAnalysisById);

module.exports = router;
