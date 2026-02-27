# SaludPlus - Hybrid Database Architecture System

## 1. Project Overview
SaludPlus is a backend system designed to demonstrate a Hybrid Database Architecture. It integrates a relational database (MariaDB) for structured entity management and a document-based database (MongoDB) for flexible, read-optimized clinical histories. The system includes an ETL (Extract, Transform, Load) pipeline to process CSV data and distribute it across both databases simultaneously.

## 2. System Architecture
The architecture is built on a Node.js and Express.js backend, utilizing the MVC (Model-View-Controller) design pattern to cleanly separate database operations.



* **Client Layer:** Frontend interface rendering dynamic data via asynchronous Fetch API calls.
* **Application Layer (Node.js/Express):** Handles routing, request processing, and file upload middleware using Multer.
* **Relational Data Layer (MariaDB):** Stores strictly structured data (Doctors, Patients, Insurances, Appointments). It ensures ACID compliance and data integrity through primary and foreign key constraints.
* **Document Data Layer (MongoDB):** Stores denormalized, nested patient clinical histories. Optimized for fast retrieval of complex, array-based patient records without the computational overhead of SQL JOIN operations.

## 3. Prerequisites
Before installing, ensure the following software is installed on your local machine:
* Node.js (v18.x or higher)
* MariaDB or MySQL Server
* MongoDB Server (Local or Atlas instance)
* Git

## 4. Installation and Setup

### Step 1: Clone the Repository
Execute the following commands in your terminal to clone the project and navigate into the directory:

bash:

git clone [https://github.com/JennLopezDv/SaludPlus-Backend.git](https://github.com/JennLopezDv/SaludPlus-Backend.git)
cd SaludPlus-Backend

Step 2: Install DependenciesInstall all required Node.js packages:Bashnpm install
Step 3: Database PreparationMariaDB SetupAccess your MariaDB shell or a client tool (such as DBeaver) and execute the following SQL script to create the database and the necessary relational 

mysql bash:

tables:SQLCREATE DATABASE saludplus;
USE saludplus;

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    specialty VARCHAR(100)
);

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address VARCHAR(255)
);

CREATE TABLE insurances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    coverage_percentage DECIMAL(5,2)
);

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id VARCHAR(50) UNIQUE NOT NULL,
    appointment_date DATE,
    patient_id INT,
    doctor_id INT,
    insurance_id INT,
    treatment_code VARCHAR(50),
    treatment_description TEXT,
    treatment_cost DECIMAL(10,2),
    amount_paid DECIMAL(10,2),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (insurance_id) REFERENCES insurances(id)
);

MongoDB SetupEnsure your MongoDB instance is running on localhost:27017. The Mongoose ODM will automatically create the salud_plus database and the patients_history collection upon the first insertion during the migration process.Step 4: Environment Variables ConfigurationCreate a file named .env in the root directory of the project and define the connection parameters exactly as follows:Fragmento de códigoPORT=5000

# MariaDB Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mariadb_password
DB_NAME=saludplus
DB_PORT=3306

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/salud_plus
Step 5: Start the ServerStart the development server:Bashnpm run dev
The console will output successful connection messages for both databases. You can now access the application at http://localhost:5000.5. ETL Data Migration ProcessThe core feature of this system is the CSV data migration module, which demonstrates a complete ETL pipeline:ShutterstockExplorarExtract: The user uploads a .csv file via the frontend. The multer library stores it temporarily, and the xlsx library parses the file into an array of JSON objects.Transform: The backend maps the flat CSV columns to the appropriate relational schemas and NoSQL embedded document structures.Load:MariaDB: Uses INSERT IGNORE to insert unique doctors, patients, and insurances idempotently. It retrieves the generated IDs and links them relationally in the appointments table.MongoDB: Uses findOneAndUpdate with upsert: true and the $addToSet operator. This groups multiple appointments under a single patient document based on their email, ensuring no duplicate entries exist in the clinical history array.6. API EndpointsMethodRouteDescriptionDatabase TargetedGET/api/doctorsRetrieves a list of doctors. Accepts an optional ?specialty= query parameter.MariaDBGET/api/patients/:email/historyRetrieves the denormalized, nested clinical history for a specific patient.MongoDBPOST/api/migrateAccepts a multipart form data CSV upload to execute the ETL pipeline.MariaDB & MongoDB7.

Directory StructurePlaintextSaludPlus-Backend/
├── config/
│   └── db.js                 # MariaDB connection pool setup
├── controllers/
│   ├── doctorController.js   # MariaDB read operations
│   ├── migrateController.js  # ETL pipeline logic
│   └── patientController.js  # MongoDB read operations
├── models/
│   └── patientHistory.js     # Mongoose schema definition
├── public/
│   ├── index.html            # Frontend UI
│   └── js/
│       └── main.js           # Frontend logic and API integration
├── routes/
│   ├── doctorRoutes.js       # Doctor endpoint routing
│   ├── migrateRoutes.js      # Migration endpoint routing
│   └── patientRoutes.js      # Patient endpoint routing
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
├── index.js                  # Application entry point and server setup
└── package.json              # Dependencies and scripts
