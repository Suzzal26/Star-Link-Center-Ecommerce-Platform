# 🚀 Production Deployment Guide - Image URL Fixes

## ✅ Problem Solved

Your application now properly handles image URLs in production. Images are stored in MongoDB Atlas using GridFS and served with correct HTTPS URLs.

## 🔧 Changes Made

### 1. Backend Updates

**File: `server/modules/products/product.controller.js`**
- Updated `getBaseUrl()` function to detect `starlinkcenter.com.np` domains
- Images now serve from: `https://www.starlinkcenter.com.np/api/v1/images/{imageId}`

**File: `server/modules/products/productRoutes.js`**
- Updated URL generation logic for production domains
- Consistent with controller changes

**File: `server/index.js`**
- CORS already configured for your production domains
- Static file serving enabled for `/uploads` (fallback)

### 2. Frontend Updates

**File: `client/src/constants/index.js`**
- Updated `BASE_URL` to use `https://www.starlinkcenter.com.np` in production
- API calls now use correct production URLs

## 🌐 Production Environment Variables

Create a `.env` file in your server directory with:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret

# Production URLs
BASE_URL=https://www.starlinkcenter.com.np
NODE_ENV=production

# Server Configuration
PORT=5000

# Email Configuration (if needed)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

## 🖼️ Image Storage Architecture

### How Images Work Now:

1. **Upload**: Images uploaded via admin panel → GridFS in MongoDB Atlas
2. **Storage**: Images stored as binary data in MongoDB (no local files)
3. **Serving**: Images served via `/api/v1/images/{imageId}` endpoint
4. **URLs**: Production URLs like `https://www.starlinkcenter.com.np/api/v1/images/507f1f77bcf86cd799439011`

### Benefits:
- ✅ No more localhost URLs in production
- ✅ Images stored securely in MongoDB Atlas
- ✅ Automatic HTTPS URLs
- ✅ No file system dependencies
- ✅ Scalable across multiple server instances

## 🧪 Testing Checklist

### Before Deployment:
- [ ] Test image upload in development
- [ ] Verify images display correctly
- [ ] Check console for no localhost references
- [ ] Test edit product functionality

### After Deployment:
- [ ] Upload new product with image
- [ ] Verify image displays on live site
- [ ] Check browser console for no mixed content errors
- [ ] Test image URLs are HTTPS
- [ ] Verify placeholder images work for missing images

## 🔍 Troubleshooting

### If Images Don't Load:
1. Check if server is running: `curl https://www.starlinkcenter.com.np/api/v1/images/placeholder`
2. Verify MongoDB connection
3. Check GridFS bucket initialization
4. Review server logs for errors

### If You See Localhost URLs:
1. Ensure `NODE_ENV=production` is set
2. Check that your domain is in the production detection logic
3. Verify frontend constants are updated

### If You Get CORS Errors:
1. Verify CORS configuration includes your domain
2. Check if API is on different subdomain
3. Ensure credentials are properly configured

## 📝 Migration Notes

### For Existing Products:
If you have existing products with local file paths, run the migration script:

```bash
cd server
node utils/migrateImagesToGridFS.js
```

This will:
- Upload existing local images to GridFS
- Update product records with new image IDs
- Preserve all existing data

### For New Deployments:
- Images will automatically use the new GridFS system
- No migration needed for new uploads

## 🎯 Expected Results

After deployment, you should see:

✅ **Image URLs**: `https://www.starlinkcenter.com.np/api/v1/images/507f1f77bcf86cd799439011`
✅ **No Localhost**: No references to `localhost:5000` in production
✅ **HTTPS Only**: All image requests use HTTPS
✅ **Mixed Content Fixed**: No more mixed content warnings
✅ **Images Load**: All images display correctly on live site

## 🚀 Deployment Steps

1. **Update Environment Variables**:
   ```bash
   # Set production environment
   export NODE_ENV=production
   export BASE_URL=https://www.starlinkcenter.com.np
   ```

2. **Deploy Backend**:
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Deploy Frontend**:
   ```bash
   cd client
   npm run build
   # Deploy build folder to your hosting
   ```

4. **Test Everything**:
   - Upload new product with image
   - View product on live site
   - Check image URLs in browser dev tools

## 🎉 Success!

Your e-commerce platform now has:
- ✅ Proper production image URLs
- ✅ MongoDB Atlas image storage
- ✅ No more localhost references
- ✅ HTTPS-only image serving
- ✅ Scalable image architecture

All image-related issues should now be resolved! 🚀 