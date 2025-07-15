const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('ecommerce');
  } catch (error) {
    console.error('Connection error:', error);
  }
}

module.exports = connectDB;
