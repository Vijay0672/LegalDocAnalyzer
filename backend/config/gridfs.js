const multer = require('multer');

// Use Memory Storage
// This allows us to access the file buffer directly in the controller
// for both AI analysis and manual streaming to GridFS.
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit to 10MB
});

module.exports = upload;
