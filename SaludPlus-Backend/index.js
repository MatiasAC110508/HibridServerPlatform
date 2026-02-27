require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 1. Import connections
const pool = require('./config/db');  // Pool for MariaDB (myslq2)
const connectMongo = require('./config/mongo');   // Mongoose function
const reportRoutes = require('./routes/reportRoutes');
const patientRoutes = require('./routes/patientRoutes');

const app = express();

// 2. Middlewares
app.use(cors());
app.use(express.json());

// Static files (for the index.html and Multer uploads)
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Initialize the DB
const startApp = async () => {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Test the connection with MariaDB
        await pool.query('SELECT 1');
        console.log('MariaDB connected!')

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`SaludPlus Server in: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing: ', error)
    }
};

// 4. Rutas (Ajustadas al simulacro)
const doctorRoutes = require('./routes/doctorRoutes');
const migrateRoutes =  require('./routes/migrateRoutes');   // Needed to Excel

app.use('/api/doctors', doctorRoutes);     // Changing of /api/users a /api/doctors 
app.use('/api/migrate', migrateRoutes);    // Route to migration
app.use('/api/reports', reportRoutes);
app.use('/api/patients', patientRoutes);

// Test root
app.get('/', (req, res) => {
    res.send('SaludPlus hibrid API running...')
});



startApp()