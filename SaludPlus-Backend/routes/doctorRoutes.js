const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Route to get all doctors, with optional specialty query parameter
router.get('/', doctorController.getDoctors);

module.exports = router;