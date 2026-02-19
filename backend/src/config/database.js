const mongoose = require('mongoose');

// Connection cache for serverless environments
let isConnected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI is missing');
        return;
    }

    if (isConnected) {
        console.log('✅ Using existing MongoDB connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10s
        });

        isConnected = db.connections[0].readyState;
        console.log('✅ New MongoDB connection established');
    } catch (error) {
        console.error('❌ MongoDB Error:', error.message);
    }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error(`❌ Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed through app termination');
    process.exit(0);
});

module.exports = connectDB;
