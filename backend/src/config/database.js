const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI is not defined in environment variables');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Don't exit process in serverless environments
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
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
