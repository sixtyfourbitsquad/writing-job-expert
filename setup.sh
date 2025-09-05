#!/bin/bash

# FreelanceHub Setup Script
# This script sets up the complete FreelanceHub application

echo "🚀 Setting up FreelanceHub - Professional Freelance Marketplace"
echo "=============================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create environment files
echo "⚙️  Setting up environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env file..."
    cat > backend/.env << EOF
# Database
MONGODB_URI=mongodb://localhost:27017/freelancehub

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin UPI Settings
ADMIN_UPI_ID=admin@paytm
ADMIN_QR_CODE_URL=https://example.com/qr-code.png

# Cloudinary (for file uploads) - Optional
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EOF
    echo "✅ Created backend/.env file"
else
    echo "⚠️  backend/.env already exists, skipping..."
fi

# Frontend .env.local
if [ ! -f "frontend/.env.local" ]; then
    echo "Creating frontend/.env.local file..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF
    echo "✅ Created frontend/.env.local file"
else
    echo "⚠️  frontend/.env.local already exists, skipping..."
fi

# Create MongoDB setup script
echo "🗄️  Creating MongoDB setup script..."
cat > setup-database.js << 'EOF'
// MongoDB Setup Script for FreelanceHub
// Run this with: node setup-database.js

const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancehub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database setup complete!');
  console.log('🚀 You can now start the application with: npm run dev');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('💡 Make sure MongoDB is running locally or update MONGODB_URI in backend/.env');
  process.exit(1);
});
EOF

echo "✅ Created database setup script"

# Create start script
echo "📝 Creating start script..."
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting FreelanceHub..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "Press Ctrl+C to stop"
npm run dev
EOF

chmod +x start.sh

# Create production build script
echo "📝 Creating production build script..."
cat > build.sh << 'EOF'
#!/bin/bash
echo "🏗️  Building FreelanceHub for production..."

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Install production dependencies
echo "Installing production dependencies..."
cd backend
npm install --production
cd ..

echo "✅ Production build complete!"
echo "To start in production mode:"
echo "  cd backend && npm start"
EOF

chmod +x build.sh

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running locally or update MONGODB_URI in backend/.env"
echo "2. Test database connection: node setup-database.js"
echo "3. Start development servers: ./start.sh"
echo "   Or manually: npm run dev"
echo ""
echo "📁 Project structure:"
echo "  frontend/     - Next.js frontend application"
echo "  backend/      - Node.js/Express backend API"
echo "  README.md     - Complete documentation"
echo "  DEPLOYMENT.md - Deployment instructions"
echo ""
echo "🔧 Configuration:"
echo "  - Backend config: backend/.env"
echo "  - Frontend config: frontend/.env.local"
echo ""
echo "🚀 Quick start:"
echo "  ./start.sh"
echo ""
echo "📚 Documentation:"
echo "  - README.md for complete setup guide"
echo "  - DEPLOYMENT.md for production deployment"
echo ""
echo "Happy coding! 🎯"
