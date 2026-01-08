const Contract = require('../models/Contract');
const { analyzeContractText } = require('../services/aiService');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const mongoose = require('mongoose');
const { Readable } = require('stream');

// Helper to calculate file processing
const bufferToStream = (buffer) => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
};

// @desc    Upload contract and start analysis
// @route   POST /api/contracts/upload
// @access  Private
const uploadContract = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });

        // 1. Manually Stream Buffer to GridFS
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
            metadata: {
                originalName: req.file.originalname,
                uploadedBy: req.user.id
            }
        });

        const readStream = bufferToStream(req.file.buffer);
        readStream.pipe(uploadStream);

        // Wait for upload to complete
        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        const fileId = uploadStream.id; // Get the generated GridFS ID

        // 2. Create Initial Contract Record
        const contract = await Contract.create({
            userId: req.user.id,
            filename: req.file.originalname,
            fileId: fileId,
            status: 'processing'
        });

        res.status(201).json(contract);

        // 3. Async Analysis (Fire and forget)
        // We already have the buffer, so no need to fetch from GridFS again!
        analyzeAndSave(contract._id, req.file.buffer, req.file.mimetype);

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
};

const analyzeAndSave = async (contractId, buffer, contentType) => {
    try {
        let text = '';

        // Extract Text directly from buffer
        if (contentType === 'application/pdf') {
            const data = await pdfParse(buffer);
            text = data.text;
        } else if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            // Should not happen if frontend validation is correct, but safe fallback
            throw new Error(`Unsupported content type: ${contentType}`);
        }

        // Call AI
        const analysisResult = await analyzeContractText(text);

        // Update Contract
        await Contract.findByIdAndUpdate(contractId, {
            status: 'completed',
            summary: analysisResult.summary || 'No summary available',
            clauses: analysisResult.clauses || []
        });
        console.log(`Analysis completed for contract ${contractId}`);

    } catch (error) {
        console.error(`Analysis failed for contract ${contractId}:`, error);
        await Contract.findByIdAndUpdate(contractId, {
            status: 'failed'
        });
    }
};

// @desc    Get all user contracts
// @route   GET /api/contracts
// @access  Private
const getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single contract
// @route   GET /api/contracts/:id
// @access  Private
const getContract = async (req, res) => {
    try {
        const contract = await Contract.findOne({ _id: req.params.id, userId: req.user.id });
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        res.json(contract);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    uploadContract,
    getContracts,
    getContract
};
