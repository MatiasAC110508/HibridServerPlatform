# SaludPlus - Hybrid Database Architecture

## Project Overview
SaludPlus is a healthcare management system demonstrating a hybrid database architecture. It utilizes both relational (MariaDB) and non-relational (MongoDB) databases to optimize data storage, retrieval, and structural flexibility.



## 1. Database Paradigms Utilized

### MariaDB (Relational / SQL)
Used for structured, highly relational data where ACID compliance and strict normalization are required.
* **Use Case:** Storing specific entities like Patients, Doctors, and Insurances.
* **Concepts Applied:**
    * **Normalization:** Data is split into distinct tables to reduce redundancy.
    * **Foreign Keys:** The `appointments` table uses `doctor_id` and `patient_id` to establish relationships.
    * **Connection Pooling:** The application uses `mysql2/promise` with a connection pool to handle multiple concurrent database requests efficiently.

### MongoDB (Non-Relational / NoSQL)
Used for unstructured or heavily nested data where read speed and schema flexibility are prioritized.
* **Use Case:** Storing the complete clinical history of a patient.
* **Concepts Applied:**
    * **Denormalization (Embedded Documents):** Instead of joining tables, all appointments for a single patient are embedded inside an `appointments` array within the patient's document.
    * **Fast Read Operations:** Fetching a patient's entire medical history requires only a single query to one collection, drastically reducing read latency compared to complex SQL JOINs.

## 2. The ETL Pipeline (Extract, Transform, Load)
The system features a data migration module that takes raw data from a `.csv` file and distributes it across both databases.



[Image of ETL process diagram Extract Transform Load]


* **Extract:** Multer handles the file upload, and the `xlsx` library parses the CSV rows into JSON objects.
* **Transform:** The backend remaps variable names (e.g., matching `doctor_name` to the correct SQL insertion logic and structuring the NoSQL document).
* **Load:** The data is inserted into MariaDB and MongoDB sequentially.

## 3. Key Database Concepts Implemented

### Idempotency
The migration script is idempotent, meaning running the exact same file multiple times will not create duplicate records or crash the system.
* **SQL Implementation:** Using `INSERT IGNORE INTO ...`. If a unique constraint (like an email) already exists, MariaDB skips the insertion without throwing an error.
* **NoSQL Implementation:** Using `findOneAndUpdate` with the `$addToSet` operator and `upsert: true`.
    * `upsert: true`: Creates the document if the patient does not exist, or updates it if they do.
    * `$addToSet`: Ensures that an appointment is only added to the array if an identical appointment does not already exist inside it.

## 4. API Endpoints Reference

### Doctors (MariaDB)
* `GET /api/doctors`: Retrieves a list of doctors.
* `GET /api/doctors?specialty=General`: Retrieves doctors filtered by specialty using a SQL `WHERE` clause.

### Patients (MongoDB)
* `GET /api/patients/:email/history`: Retrieves the denormalized clinical history of a specific patient.

### Migration (ETL)
* `POST /api/migrate`: Accepts a `multipart/form-data` CSV file and executes the ETL pipeline.
