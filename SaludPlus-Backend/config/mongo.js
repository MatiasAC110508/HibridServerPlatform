const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB has been connected correctly!');
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error.message);
        process.exit(1) // Stops the app if the connection fails
    }
};

module.exports = connectDB;