const xlsx = require('xlsx');
const fs = require('fs');
const db = require('../config/db');      // FIXED: Added /
const PatientHistory = require('../models/patientHistory'); 

const migrateData = async (req, res) => {
    if (!req.file) return res.status(400).json({error: 'No file uploaded'});

    try {
        const workBook = xlsx.readFile(req.file.path);
        const sheetName = workBook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workBook.Sheets[sheetName]);

        for (const row of data) {
            const {
                patient_name, patient_email, patient_phone, patient_address,
                doctor_name, doctor_email, doctor_specialty,
                insurance_name, coverage,
                appointment_id, appointment_date, 
                treatment_code, treatment_description, treatment_cost, amount_paid
            } = row;

            // 1. SQL MIGRATION (MariaDB)
            
            // Patient (Fixed: correct variables)
            await db.query(
                'INSERT IGNORE INTO patients (name, email, phone, address) VALUES (?, ?, ?, ?)',
                [patient_name, patient_email, patient_phone, patient_address]
            );

            // Doctor (Fixed: 3 columns = 3 placeholders)
            await db.query(
                'INSERT IGNORE INTO doctors (name, email, specialty) VALUES (?, ?, ?)',
                [doctor_name, doctor_email, doctor_specialty]
            );

            // Insurance
            if (insurance_name) {
                await db.query(
                    'INSERT IGNORE INTO insurances (name, coverage_percentage) VALUES (?, ?)',
                    [insurance_name, coverage]
                );
            }

            // Get IDs (SQL requires these to link the appointment)
            const [[patient]] = await db.query('SELECT id FROM patients WHERE email = ?', [patient_email]);
            const [[doctor]] = await db.query('SELECT id FROM doctors WHERE email = ?', [doctor_email]);
            let insuranceId = null;
            if (insurance_name) {
                const [[insurance]] = await db.query('SELECT id FROM insurances WHERE name = ?', [insurance_name]);
                insuranceId = insurance ? insurance.id : null;
            }
            
            // Appointment
            await db.query(
                `INSERT IGNORE INTO appointments (appointment_id, appointment_date, patient_id, doctor_id, insurance_id,
                 treatment_code, treatment_description, treatment_cost, amount_paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [appointment_id, appointment_date, patient.id, doctor.id, insuranceId, treatment_code, treatment_description, treatment_cost, amount_paid]
            );

            // 2. MONGODB MIGRATION (History)
            const appointmentData = {
                appointmentId: appointment_id, // Fixed mapping
                date: appointment_date,
                doctorName: doctor_name,
                specialty: doctor_specialty,
                treatmentDescription: treatment_description,
                amountPaid: amount_paid
            };

            await PatientHistory.findOneAndUpdate(
                { patientEmail: patient_email },
                {
                    $set: { patientName: patient_name },
                    $addToSet: { appointments: appointmentData } 
                },
                { upsert: true }
            );
        }

        fs.unlinkSync(req.file.path);
        res.json({message: 'Migration successfully completed in SQL and MongoDB'});

    } catch (error) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error(error);
        res.status(500).json({error: 'Error during migration'});
    }
};

module.exports = { migrateData };