const mongoose = require('mongoose');
const path = require('path');

// Ensure mongodb-memory-server stores binary inside workspace to prevent sandbox permission errors
process.env.MONGOMS_DOWNLOAD_DIR = path.join(__dirname, '../.mongo-bin');
process.env.MONGOMS_PREFER_GLOBAL_PATH = 'false';

/**
 * Connect to MongoDB Database
 * Supports MongoDB Atlas URI or local MongoDB connection.
 * If external connection fails in development/demo, gracefully attempts an in-memory instance
 * so the viva demo never crashes!
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.warn('⚠️  MONGODB_URI not set in environment. Attempting in-memory MongoDB fallback...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create({
          instance: {
            dbName: 'skillbridge',
          },
        });
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`✅ In-Memory MongoDB connected: ${conn.connection.host}`);
        console.log('💡 Note: Data is kept in memory. For persistent storage, set MONGODB_URI in server/.env');
        return;
      } catch (memErr) {
        console.error('In-memory MongoDB not available:', memErr.message);
        throw memErr;
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Try fallback to in-memory if network or credentials failed during local testing
    try {
      console.log('🔄 Attempting fallback to in-memory MongoDB for local demo...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'skillbridge',
        },
      });
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ Fallback In-Memory MongoDB connected: ${conn.connection.host}`);
    } catch (fallbackErr) {
      console.error('❌ Could not establish database connection:', fallbackErr.message);
      console.error('Please configure a valid MONGODB_URI in server/.env or ensure MongoDB is running.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;

