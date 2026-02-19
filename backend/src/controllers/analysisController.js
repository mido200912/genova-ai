const HealthAnalysis = require('../models/HealthAnalysis');
const openRouterService = require('../services/openRouterService');
const { validationResult } = require('express-validator');

/**
 * Analyze symptoms using AI
 * POST /api/analysis
 */
exports.analyzeSymptoms = async (req, res) => {
    const startTime = Date.now();

    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }

        const { symptoms } = req.body;
        const userId = req.userId;

        // Check if AI service is configured
        if (!openRouterService.isConfigured()) {
            return res.status(503).json({
                success: false,
                message: 'AI service is not configured. Please contact administrator.',
            });
        }

        // Call AI service
        console.log('Analyzing symptoms for user:', userId);
        const aiResponse = await openRouterService.analyzeSymptoms(symptoms);

        const processingTime = Date.now() - startTime;

        // Save analysis to database
        const healthAnalysis = new HealthAnalysis({
            userId,
            userInput: symptoms,
            aiResponse,
            metadata: {
                processingTime,
                modelUsed: 'google/gemini-2.0-flash-lite-preview-02-05:free',
                analyzed: true,
            },
        });

        await healthAnalysis.save();

        res.status(200).json({
            success: true,
            message: 'Analysis completed successfully',
            data: {
                analysisId: healthAnalysis._id,
                result: aiResponse,
                processingTime: `${processingTime}ms`,
                createdAt: healthAnalysis.createdAt,
            },
        });
    } catch (error) {
        console.error('Analysis Error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to analyze symptoms',
            error: error.message,
            processingTime: `${Date.now() - startTime}ms`,
        });
    }
};

/**
 * Get single analysis by ID
 * GET /api/analysis/:id
 */
exports.getAnalysisById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const analysis = await HealthAnalysis.findOne({
            _id: id,
            userId,
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found',
            });
        }

        res.json({
            success: true,
            data: analysis,
        });
    } catch (error) {
        console.error('Get Analysis Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analysis',
            error: error.message,
        });
    }
};
