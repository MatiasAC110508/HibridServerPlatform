// Definitions of constants to avoid typing errors in querys
const SQL_TABLES = {
    PATIENTS: 'patients',
    DOCTORS: 'doctors',
    INSURANCE: 'insurances',
    APPOINTMENTS: 'appointments'
};

const SQL_FIELDS = {
    PATIENT: ['id', 'name', 'email', 'phone', 'adress'],
    DOCTOR: ['id', 'name', 'email', 'specialty'],
    APPOINTMENT: [
        'id', 'appointment_id', 'appointment_date', 'patient_id', 
        'doctor_id', 'insurance_id', 'treatment_code', 
        'treatment_description', 'treatment_cost', 'amount_paid'
    ]
};

module.exports = {SQL_TABLES, SQL_FIELDS};