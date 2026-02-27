const mongoose = require('mongoose');

// Sub-schema for date within the historial
const appointmentSchema = new mongoose.Schema({
    appointmentId: {type: String, required: true},
    date: {type: Date, required: true},
    doctorName: {type: String, require: true},
    specialty: {type: String, required: true},
    treatmentDescription: {type: String},
    amountPaid: {type: Number, default: 0}
    
});

// Principal historial schema
const patientHistorySchema =  new mongoose.Schema({
    patientEmail: {type: String, required: true, unique: true},
    patientName: {type: String, required: true},
    appointments: [appointmentSchema]     // Array of objects for quick consultances
}, {
    timestamps: true,
    collections: 'patients_histories'
});

module.exports = mongoose.model('PatientHistory', patientHistorySchema);