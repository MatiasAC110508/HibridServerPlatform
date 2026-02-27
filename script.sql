CREATE DATABASE saludPlusDB;USE saludPlusDB;
MariaDB [saludPlusDB]> CREATE TABLE patients (
    ->     id SERIAL PRIMARY KEY,
    ->     name VARCHAR(150) NOT NULL,
    ->     email VARCHAR(150) UNIQUE NOT NULL,
    ->     phone VARCHAR(20),
    ->     address TEXT
    -> );
CREATE TABLE doctors(id SERIAL PRIMARY KEY,     name VARCHAR(150) NOT NULL,     email VARCHAR(150) UNIQUE NOT NULL, specialty VARCHAR(50));
CREATE TABLE insurances(id SERIAL PRIMARY KEY,     name VARCHAR(150) NOT NULL, coverage_percentage DECIMAL(5,2) CHECK (coverage_percentage >= 0 AND coverage_percentage <= 100));
CREATE TABLE appointments (
    ->     id SERIAL PRIMARY KEY,
    ->     appointment_id VARCHAR(50) UNIQUE NOT NULL,
    ->     appointment_date DATE NOT NULL,
    ->     patient_id BIGINT UNSIGNED NOT NULL,
    ->     doctor_id BIGINT UNSIGNED NOT NULL,
    ->     insurance_id BIGINT UNSIGNED,
    ->     treatment_code VARCHAR(20),
    ->     treatment_description TEXT,
    ->     treatment_cost DECIMAL(12,2) DEFAULT 0.00,
    ->     amount_paid DECIMAL(12,2) DEFAULT 0.00,
    ->     
    ->     -- Restricciones
    ->     CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    ->     CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    ->     CONSTRAINT fk_insurance FOREIGN KEY (insurance_id) REFERENCES insurances(id) ON DELETE SET NULL
    -> );
    

