const mongoose = require('mongoose');
const multer = require('multer');
const GridFSBucket = require('mongodb').GridFSBucket;
const path = require('path');

// GridFS bucket for storing images
let gridfsBucket;

// Initialize GridFS bucket when MongoDB connects
const initializeGridFS = () => {
  if (mongoose.connection.readyState === 1) {
    gridfsBucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    console.log('✅ GridFS bucket initialized');
  }
};

// Initialize immediately if already connected
initializeGridFS();

// Initialize when connection opens
mongoose.connection.once('open', initializeGridFS);

// Re-initialize on reconnection
mongoose.connection.on('connected', initializeGridFS);

// Multer configuration for GridFS
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Function to upload file to GridFS
const uploadToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    console.log('🔍 Starting GridFS upload for:', file.originalname);
    
    if (!gridfsBucket) {
      console.error('❌ GridFS bucket not initialized');
      return reject(new Error('GridFS bucket not initialized'));
    }

    if (!file.buffer) {
      console.error('❌ No file buffer provided');
      return reject(new Error('No file buffer provided'));
    }

    const filename = `${Date.now()}_${file.originalname}`;
    console.log('📝 Creating upload stream for:', filename);
    
    const uploadStream = gridfsBucket.openUploadStream(filename, {
      metadata: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        uploadDate: new Date()
      }
    });

    uploadStream.on('error', (error) => {
      console.error('❌ Upload stream error:', error);
      reject(error);
    });

    uploadStream.on('finish', (uploadedFile) => {
      console.log('✅ Upload completed:', uploadedFile._id);
      resolve(uploadedFile);
    });

    // Write file buffer to GridFS
    console.log('📤 Writing buffer to GridFS...');
    uploadStream.end(file.buffer);
  });
};

// Function to delete file from GridFS
const deleteFromGridFS = (fileId) => {
  return new Promise((resolve, reject) => {
    if (!gridfsBucket) {
      return reject(new Error('GridFS bucket not initialized'));
    }

    gridfsBucket.delete(new mongoose.Types.ObjectId(fileId), (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

// Function to get file stream from GridFS
const getFileStream = (fileId) => {
  if (!gridfsBucket) {
    throw new Error('GridFS bucket not initialized');
  }

  return gridfsBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
};

// Function to get file info from GridFS
const getFileInfo = async (fileId) => {
  if (!gridfsBucket) {
    throw new Error('GridFS bucket not initialized');
  }

  const files = await gridfsBucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
  return files.length > 0 ? files[0] : null;
};

module.exports = {
  upload,
  uploadToGridFS,
  deleteFromGridFS,
  getFileStream,
  getFileInfo,
  gridfsBucket: () => gridfsBucket
};