# FreelanceHub - Professional Freelance Marketplace

A complete freelance marketplace platform built with Next.js, Node.js, Express, and MongoDB. Features include job posting, bidding, real-time chat, UPI payments, and admin dashboard.

## 🚀 Features

### Core Features
- **User Authentication & Profiles** - JWT-based auth with secure sessions
- **Job Listings & Bidding** - Post jobs, bid on projects, manage job lifecycle
- **Real-time Communication** - Socket.IO powered chat with file sharing
- **Manual UPI Payment Gateway** - Secure payment processing with admin verification
- **Ratings & Reviews** - Comprehensive review system for quality assurance
- **Admin Dashboard** - Complete admin panel with analytics and management tools

### Technical Features
- **Premium UI/UX** - Orange and black theme with smooth animations
- **Mobile-First Design** - Fully responsive across all devices
- **Real-time Updates** - Live chat and notifications
- **Secure Payments** - UPI integration with manual verification
- **File Upload** - Support for documents, images, and portfolio items
- **Advanced Search** - Filter jobs by category, budget, skills, and more

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Socket.IO Client** - Real-time communication
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## 📁 Project Structure

```
freelance-marketplace/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts
│   └── public/             # Static assets
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
└── package.json            # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account or local MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freelance-marketplace
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   
   **Backend Environment** (`backend/.env`):
   ```env
   MONGODB_URI=mongodb://localhost:27017/freelancehub
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ADMIN_UPI_ID=admin@paytm
   ADMIN_QR_CODE_URL=https://example.com/qr-code.png
   ```

   **Frontend Environment** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start Development Servers**
   ```bash
   # From root directory
   npm run dev
   
   # Or start individually
   # Frontend (Terminal 1)
   cd frontend && npm run dev
   
   # Backend (Terminal 2)
   cd backend && npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🗄 Database Setup

### MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env`

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/freelancehub` as `MONGODB_URI`

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Prepare for deployment**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set build command: `npm run build`
   - Set output directory: `.next`
   - Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

### Backend Deployment (Render)

1. **Prepare for deployment**
   ```bash
   cd backend
   # Ensure all dependencies are in package.json
   ```

2. **Deploy to Render**
   - Connect your GitHub repository to Render
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables from your `.env` file

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Configure network access (0.0.0.0/0 for production)
3. Create a database user
4. Get your connection string
5. Update `MONGODB_URI` in your production environment

## 🔧 Configuration

### Admin Setup

1. Create an admin user by updating the database directly:
   ```javascript
   // In MongoDB
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. Set UPI details in admin panel or environment variables

### Payment Configuration

1. Update `ADMIN_UPI_ID` with your UPI ID
2. Upload QR code and set `ADMIN_QR_CODE_URL`
3. Configure payment verification process

## 📱 Features Overview

### For Clients
- Post job requirements with detailed descriptions
- Review and select freelancer proposals
- Make secure payments via UPI
- Track project progress
- Rate and review completed work

### For Freelancers
- Browse and filter available jobs
- Submit competitive proposals
- Communicate with clients in real-time
- Manage portfolio and skills
- Track earnings and reviews

### For Admins
- Manage users and content
- Verify payments manually
- View analytics and reports
- Configure platform settings

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job

### Bids
- `POST /api/bids` - Create bid
- `GET /api/bids/my-bids` - Get user's bids
- `PUT /api/bids/:id` - Update bid

### Payments
- `POST /api/payments/create` - Create payment
- `POST /api/payments/:id/submit-utr` - Submit UTR
- `GET /api/payments/my-payments` - Get user payments

### Messages
- `GET /api/messages/:roomId` - Get messages
- `POST /api/messages` - Send message

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@freelancehub.com

## 🔄 Updates

### Version 1.0.0
- Initial release
- Core marketplace functionality
- UPI payment integration
- Real-time chat
- Admin dashboard

---

**Built with ❤️ for the freelance community**
