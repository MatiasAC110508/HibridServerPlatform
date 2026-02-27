const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET/api/reports/revenue
router.get('/revenue', reportController.getRevenueReport)

module.exports = router;
