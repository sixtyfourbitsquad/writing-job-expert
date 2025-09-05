# 🚀 Quick Start Guide - FreelanceHub

## Prerequisites

Before running the application, make sure you have:

1. **Node.js 18+** installed
2. **MongoDB** running (local or Atlas)

## Installation Steps

### 1. Install Node.js (if not already installed)

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version**
3. Install with default settings
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 2. Set up MongoDB

**Option A: Local MongoDB**
1. Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. Start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

### 3. Run the Application

**Easy Method (Windows):**
```bash
# Double-click start-local.bat
# OR run in command prompt:
start-local.bat
```

**Manual Method:**
```bash
# 1. Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 2. Start backend (Terminal 1)
cd backend
npm run dev

# 3. Start frontend (Terminal 2)
cd frontend
npm run dev
```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Default Admin Account

To create an admin account, update a user in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Troubleshooting

### Node.js not found
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal/command prompt

### MongoDB connection error
- Make sure MongoDB is running
- Check connection string in `backend/.env`
- For Atlas: whitelist your IP address

### Port already in use
- Change ports in environment files
- Kill processes using ports 3000/5000

## Features Available

✅ User Registration/Login
✅ Job Posting & Bidding
✅ Real-time Chat
✅ UPI Payment System
✅ Admin Dashboard
✅ Ratings & Reviews

## Next Steps

1. Register as a client or freelancer
2. Post jobs or browse opportunities
3. Test the payment system
4. Explore admin features

---

**Need Help?** Check the main README.md for detailed documentation.
