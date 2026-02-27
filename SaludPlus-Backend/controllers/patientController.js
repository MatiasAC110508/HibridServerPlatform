const PatientHistory = require('../models/patientHistory');

// (READ) Get history by email (used by your frontend search bar)
const getPatientHistory = async (req, res) => {
    try {
        const { email } = req.params;
        const history = await PatientHistory.findOne({ patientEmail: email });
        
        if (!history) {
            return res.status(404).json({ message: 'History not found' });
        }
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// You can move your CREATE, UPDATE, DELETE logic here if the project requires it
const createPatientHistory = async (req, res) => {
    try {
        const newHistory = new PatientHistory(req.body);
        await newHistory.save();
        res.status(201).json(newHistory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPatientHistory,
    createPatientHistory
};