const HealthAnalysis = require('../models/HealthAnalysis');

/**
 * Get user's analysis history
 * GET /api/history
 */
exports.getHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const { limit = 10, page = 1, sortBy = 'createdAt', order = 'desc' } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === 'asc' ? 1 : -1;

        // Get analyses with pagination
        const analyses = await HealthAnalysis.find({ userId })
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        // Get total count
        const totalCount = await HealthAnalysis.countDocuments({ userId });
        const totalPages = Math.ceil(totalCount / parseInt(limit));

        res.json({
            success: true,
            data: {
                analyses,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage: parseInt(limit),
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1,
                },
            },
        });
    } catch (error) {
        console.error('Get History Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch history',
            error: error.message,
        });
    }
};

/**
 * Get history statistics
 * GET /api/history/stats
 */
exports.getHistoryStats = async (req, res) => {
    try {
        const userId = req.userId;

        const totalAnalyses = await HealthAnalysis.countDocuments({ userId });

        const emergencyCount = await HealthAnalysis.countDocuments({
            userId,
            'aiResponse.emergency_flag': true,
        });

        const recentAnalyses = await HealthAnalysis.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('createdAt aiResponse.analysis_summary aiResponse.emergency_flag');

        res.json({
            success: true,
            data: {
                totalAnalyses,
                emergencyCount,
                recentAnalyses,
            },
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message,
        });
    }
};

/**
 * Delete analysis from history
 * DELETE /api/history/:id
 */
exports.deleteAnalysis = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const analysis = await HealthAnalysis.findOneAndDelete({
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
            message: 'Analysis deleted successfully',
        });
    } catch (error) {
        console.error('Delete Analysis Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete analysis',
            error: error.message,
        });
    }
};
