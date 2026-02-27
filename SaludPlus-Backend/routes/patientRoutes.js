const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// GET/patients/:email/history
router.get('/:email/history', patientController.getPatientHistory);

module.exports = router;