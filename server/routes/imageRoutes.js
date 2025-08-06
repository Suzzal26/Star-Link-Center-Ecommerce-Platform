const express = require('express');
const { getFileStream, getFileInfo } = require('../services/gridfsService');
const { generatePlaceholder } = require('../services/placeholderService');
const router = express.Router();

// Route to serve images from GridFS
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Handle special case for placeholder
    if (fileId === 'placeholder') {
      const width = parseInt(req.query.w) || 300;
      const height = parseInt(req.query.h) || 300;
      const color = req.query.color || 'f0f0f0';
      
      const placeholder = generatePlaceholder(width, height, color);
      
      res.set({
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      });
      
      return res.send(placeholder);
    }
    
    // Get file info first to check if file exists and get metadata
    const fileInfo = await getFileInfo(fileId);
    
    if (!fileInfo) {
      // Redirect to placeholder if image not found
      return res.redirect('/api/v1/images/placeholder');
    }

    // Set appropriate headers
    res.set({
      'Content-Type': fileInfo.metadata?.mimetype || 'image/jpeg',
      'Content-Length': fileInfo.length,
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      'ETag': fileInfo._id.toString()
    });

    // Stream the file
    const downloadStream = getFileStream(fileId);
    
    downloadStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.redirect('/api/v1/images/placeholder');
      }
    });

    downloadStream.pipe(res);
    
  } catch (error) {
    console.error('Error serving image:', error);
    if (!res.headersSent) {
      res.redirect('/api/v1/images/placeholder');
    }
  }
});

module.exports = router;