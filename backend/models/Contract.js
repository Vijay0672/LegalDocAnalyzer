const mongoose = require('mongoose');

const clauseSchema = new mongoose.Schema({
    id: String,
    text: String,
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'unknown'], // Added unknown for safety
        default: 'low'
    },
    riskReason: String,
    notes: String // User notes
});

const contractSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    filename: {
        type: String,
        required: true
    },
    fileId: {
        type: mongoose.Schema.Types.ObjectId, // GridFS File ID
        required: true
    },
    status: {
        type: String,
        enum: ['uploaded', 'processing', 'completed', 'failed'],
        default: 'uploaded'
    },
    summary: String,
    clauses: [clauseSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Contract', contractSchema);
