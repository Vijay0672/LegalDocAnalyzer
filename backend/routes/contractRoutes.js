const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/gridfs');
const {
    uploadContract,
    getContracts,
    getContract,
    updateClauseNote
} = require('../controllers/contractController');

router.post('/upload', protect, upload.single('file'), uploadContract);
router.get('/', protect, getContracts);
router.get('/:id', protect, getContract);

router.route('/:id/clauses/:clauseId').put(protect, updateClauseNote);

module.exports = router;
