const User = require('../models/patientHistory');
const pool = require('../config/db');

// (READ) Get all doctors
exports.getDoctors = async (req, res) => {
    try {
        const { specialty } = req.query;
        
        let query = 'SELECT id, name, specialty FROM doctors';
        let queryParams = [];

        // Add filter if the frontend sends a specialty
        if (specialty) {
            query += ' WHERE specialty = ?';
            queryParams.push(specialty);
        }

        const [doctors] = await pool.query(query, queryParams);
        res.status(200).json(doctors);
        
    } catch (error) {
        console.error("Error in getDoctors:", error);
        res.status(500).json({ error: 'Database connection error' }); 
    }
};

// (CREATE)
exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// (UPDATE)
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// (DELETE)
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};