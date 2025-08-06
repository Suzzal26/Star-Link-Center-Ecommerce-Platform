const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { GridFSBucket } = require('mongodb');
const Product = require('../models/Product.model');

require('dotenv').config();

// Initialize GridFS bucket
let gridfsBucket;

const migrateImagesToGridFS = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    gridfsBucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    
    // Get all products that have images stored as local file paths
    const products = await Product.find({
      image: { $exists: true, $ne: null }
    });
    
    console.log(`🔍 Found ${products.length} products with images to migrate`);
    
    for (const product of products) {
      // Skip if image is already a GridFS ObjectId
      if (mongoose.Types.ObjectId.isValid(product.image)) {
        console.log(`⏭️ Product ${product.name} already uses GridFS`);
        continue;
      }
      
      // Construct file path
      const imagePath = path.join(__dirname, '../uploads', product.image);
      
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        console.log(`❌ File not found: ${imagePath} for product ${product.name}`);
        continue;
      }
      
      try {
        // Read file
        const fileBuffer = fs.readFileSync(imagePath);
        
        // Get file extension
        const ext = path.extname(product.image);
        const mimeType = getMimeType(ext);
        
        // Upload to GridFS
        const uploadStream = gridfsBucket.openUploadStream(product.image, {
          metadata: {
            originalname: product.image,
            mimetype: mimeType,
            uploadDate: new Date(),
            migratedFrom: 'local'
          }
        });
        
        // Create promise for upload completion
        const uploadPromise = new Promise((resolve, reject) => {
          uploadStream.on('error', reject);
          uploadStream.on('finish', resolve);
        });
        
        // Write file to GridFS
        uploadStream.end(fileBuffer);
        
        // Wait for upload to complete
        const result = await uploadPromise;
        
        // Update product with new GridFS file ID
        await Product.findByIdAndUpdate(product._id, {
          image: result._id
        });
        
        console.log(`✅ Migrated ${product.image} for product ${product.name}`);
        
        // Optionally delete the original file
        // fs.unlinkSync(imagePath);
        
      } catch (error) {
        console.error(`❌ Failed to migrate ${product.image}:`, error);
      }
    }
    
    console.log('🎉 Migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Helper function to get MIME type from extension
const getMimeType = (ext) => {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  
  return mimeTypes[ext.toLowerCase()] || 'image/jpeg';
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateImagesToGridFS();
}

module.exports = migrateImagesToGridFS;