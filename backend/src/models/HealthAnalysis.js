const mongoose = require('mongoose');

const healthAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    userInput: {
        type: String,
        required: [true, 'User input is required'],
        trim: true,
        maxlength: [2000, 'Input cannot exceed 2000 characters'],
    },
    aiResponse: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    metadata: {
        processingTime: Number,
        modelUsed: {
            type: String,
            default: 'meta-llama/llama-3-8b-instruct',
        },
        analyzed: {
            type: Boolean,
            default: false,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Index for faster queries
healthAnalysisSchema.index({ userId: 1, createdAt: -1 });

// Virtual for formatted date
healthAnalysisSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
});

// Ensure virtuals are included in JSON
healthAnalysisSchema.set('toJSON', { virtuals: true });
healthAnalysisSchema.set('toObject', { virtuals: true });

const HealthAnalysis = mongoose.model('HealthAnalysis', healthAnalysisSchema);

module.exports = HealthAnalysis;
