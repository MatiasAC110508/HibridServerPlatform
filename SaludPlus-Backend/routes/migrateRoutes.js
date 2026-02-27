const express = require('express');
const router = express.Router();
const migrateController = require('../controllers/migrateController');
const multer = require('multer');


// Temporal storage settings
const upload = multer({ dest: 'uploads/' });

// POST /api/migrate
router.post('/', upload.single('file'), migrateController.migrateData);

module.exports = router;