const fs = require('fs');
const path = require('path');

// Create a simple placeholder image buffer (1x1 pixel transparent PNG)
const createPlaceholderImage = () => {
  // This is a base64 encoded 1x1 transparent PNG
  const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return Buffer.from(base64, 'base64');
};

// Generate a simple colored placeholder image
const generatePlaceholder = (width = 300, height = 300, color = 'cccccc') => {
  // Create SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle" dominant-baseline="middle">
        No Image
      </text>
    </svg>
  `;
  
  return Buffer.from(svg, 'utf8');
};

module.exports = {
  createPlaceholderImage,
  generatePlaceholder
};