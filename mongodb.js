const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'eclat_naturel';
const client = new MongoClient(uri);
let db = null;

async function connectDB() {
  if (db) return db;
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB successfully!');
    
    // Create text indexes
    try {

        await db.collection('users').createIndex({ name: 'text', email: 'text' });
        await db.collection('products').createIndex({ title: 'text', description: 'text' });
        await db.collection('cart').createIndex({ title: 'text', description: 'text' });
      console.log('Text indexes created successfully');
    } catch (indexError) {
      console.log('Index already exists or creation failed:', indexError.message);
    }
    
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function closeDB() {
  try {
    if (db) {
      await client.close();
      db = null;
      console.log('Connection to MongoDB closed.');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

async function getCollections() {
  const db = await connectDB();
  return {
    users: db.collection('users'),
    products: db.collection('products'),
    cart: db.collection('cart'),
   
  };
}

module.exports = { connectDB, closeDB, getCollections, ObjectId };
