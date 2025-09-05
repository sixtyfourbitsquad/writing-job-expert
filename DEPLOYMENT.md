# Deployment Guide - FreelanceHub

This guide will walk you through deploying the FreelanceHub application to production.

## 🎯 Deployment Overview

- **Frontend**: Vercel (Next.js)
- **Backend**: Render (Node.js/Express)
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary (optional)

## 📋 Prerequisites

1. GitHub repository with your code
2. Vercel account
3. Render account
4. MongoDB Atlas account
5. Cloudinary account (optional)

## 🗄 Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up or log in
3. Click "Create a new cluster"
4. Choose your preferred cloud provider and region
5. Select cluster tier (M0 for free tier)
6. Name your cluster (e.g., "freelancehub-cluster")
7. Click "Create Cluster"

### Step 2: Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 3: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For production, add "0.0.0.0/0" (allow from anywhere)
4. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version 4.1 or later
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with your database name (e.g., "freelancehub")

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/freelancehub?retryWrites=true&w=majority
```

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. Ensure your `backend/package.json` has a start script:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. Create a `backend/Procfile` (optional):
   ```
   web: node server.js
   ```

### Step 2: Deploy to Render

1. Go to [Render](https://render.com)
2. Sign up or log in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `freelancehub-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free tier (or upgrade as needed)

### Step 3: Set Environment Variables

In Render dashboard, go to "Environment" tab and add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/freelancehub?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.vercel.app
ADMIN_UPI_ID=your-upi-id@paytm
ADMIN_QR_CODE_URL=https://your-qr-code-url.com/qr.png
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://freelancehub-backend.onrender.com`)

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. Ensure your `frontend/package.json` has build scripts:
   ```json
   {
     "scripts": {
       "build": "next build",
       "start": "next start",
       "dev": "next dev"
     }
   }
   ```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up or log in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Set Environment Variables

In Vercel dashboard, go to "Settings" → "Environment Variables" and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL (e.g., `https://freelancehub.vercel.app`)

## 🔧 Post-Deployment Configuration

### Step 1: Update CORS Settings

Update your backend environment variables in Render:
```env
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Step 2: Create Admin User

1. Access your MongoDB Atlas dashboard
2. Go to "Browse Collections"
3. Find your database and "users" collection
4. Create a new document or update existing user:
   ```json
   {
     "name": "Admin User",
     "email": "admin@freelancehub.com",
     "password": "hashed-password",
     "role": "admin",
     "isActive": true,
     "isVerified": true
   }
   ```

### Step 3: Set Up UPI Payment

1. Generate a UPI QR code for your UPI ID
2. Upload the QR code image to a CDN or image hosting service
3. Update the `ADMIN_QR_CODE_URL` in your backend environment variables

### Step 4: Configure File Upload (Optional)

If using Cloudinary for file uploads:

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Update the Cloudinary environment variables in Render

## 🔍 Testing Your Deployment

### Frontend Tests

1. Visit your Vercel URL
2. Test user registration
3. Test user login
4. Test job posting (as client)
5. Test job browsing (as freelancer)

### Backend Tests

1. Test API endpoints using Postman or curl:
   ```bash
   # Test health endpoint
   curl https://your-backend-url.onrender.com/api/health
   
   # Test registration
   curl -X POST https://your-backend-url.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"client"}'
   ```

### Database Tests

1. Check MongoDB Atlas dashboard
2. Verify collections are created
3. Check if test data is being inserted

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` in backend environment variables
   - Ensure URLs match exactly (including https/http)

2. **Database Connection Issues**
   - Verify MongoDB Atlas network access settings
   - Check connection string format
   - Ensure database user has correct permissions

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

4. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Restart services after changing variables

### Debugging Steps

1. Check Render logs for backend issues
2. Check Vercel build logs for frontend issues
3. Use MongoDB Atlas logs for database issues
4. Test API endpoints individually

## 📊 Monitoring and Maintenance

### Performance Monitoring

1. **Render**: Monitor CPU, memory, and response times
2. **Vercel**: Check build and function performance
3. **MongoDB Atlas**: Monitor database performance and usage

### Regular Maintenance

1. Update dependencies regularly
2. Monitor error logs
3. Backup database regularly
4. Update security configurations

### Scaling Considerations

1. **Backend**: Upgrade Render instance type as needed
2. **Database**: Upgrade MongoDB Atlas cluster tier
3. **CDN**: Consider using Vercel's CDN for static assets
4. **Caching**: Implement Redis for session storage

## 🔒 Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS everywhere
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Monitor for suspicious activity
- [ ] Backup data regularly

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review service-specific documentation:
   - [Vercel Docs](https://vercel.com/docs)
   - [Render Docs](https://render.com/docs)
   - [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
3. Create an issue in the GitHub repository

---

**Happy Deploying! 🚀**
