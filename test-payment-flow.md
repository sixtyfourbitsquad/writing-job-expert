# 🧪 Payment Feature Testing Guide

## Overview
The FreelanceHub payment system uses a manual UPI verification process where:
1. **Users** submit payment with UTR number
2. **Admins** verify payments by checking UTR against UPI records
3. **System** tracks payment status and history

## 🚀 Quick Start Testing

### Step 1: Create Test Users
1. **Register as Client:** http://localhost:3000/register
   - Name: "Test Client"
   - Email: "client@test.com"
   - Password: "password123"
   - Role: "Client"

2. **Register as Freelancer:** http://localhost:3000/register
   - Name: "Test Freelancer"
   - Email: "freelancer@test.com"
   - Password: "password123"
   - Role: "Freelancer"

3. **Register as Admin:** http://localhost:3000/register
   - Name: "Test Admin"
   - Email: "admin@test.com"
   - Password: "password123"
   - Role: "Client" (we'll make this admin later)

### Step 2: Create a Test Job
1. **Login as Client:** http://localhost:3000/login
2. **Go to Jobs:** http://localhost:3000/jobs
3. **Create New Job:**
   - Title: "Test Payment Job"
   - Description: "This is a test job for payment testing"
   - Budget: "1000"
   - Category: "Web Development"
   - Deadline: "2024-12-31"

### Step 3: Bid on the Job
1. **Login as Freelancer:** http://localhost:3000/login
2. **Go to Jobs:** http://localhost:3000/jobs
3. **Find the test job and place a bid:**
   - Bid Amount: "800"
   - Proposal: "I can complete this job for $800"

### Step 4: Award the Job
1. **Login as Client:** http://localhost:3000/login
2. **Go to Dashboard:** http://localhost:3000/dashboard
3. **Find the job and accept the freelancer's bid**

### Step 5: Test Payment Submission
1. **Login as Client:** http://localhost:3000/login
2. **Go to the job details page**
3. **Click "Make Payment"**
4. **Fill payment form:**
   - Amount: "800"
   - UTR Number: "UTR123456789" (fake UTR for testing)
   - Payment Method: "UPI"
   - Notes: "Test payment"

### Step 6: Admin Payment Verification
1. **Make the admin user an admin:**
   - Go to: http://localhost:5000/api/admin/make-admin
   - Method: POST
   - Body: `{"userId": "ADMIN_USER_ID"}`

2. **Login as Admin:** http://localhost:3000/login
3. **Go to Admin Panel:** http://localhost:3000/admin
4. **Check Pending Payments**
5. **Verify the payment:**
   - Click "Verify Payment"
   - Enter UTR: "UTR123456789"
   - Status: "Verified"

## 🔧 API Testing (Advanced)

### Test Payment Creation
```bash
curl -X POST http://localhost:5000/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jobId": "JOB_ID",
    "amount": 800
  }'
```

### Test Payment Submission
```bash
curl -X POST http://localhost:5000/api/payments/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "paymentId": "PAYMENT_ID",
    "utrNumber": "UTR123456789",
    "paymentMethod": "UPI",
    "notes": "Test payment"
  }'
```

### Test Admin Verification
```bash
curl -X POST http://localhost:5000/api/payments/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "paymentId": "PAYMENT_ID",
    "status": "verified",
    "adminNotes": "Payment verified successfully"
  }'
```

## 📱 Frontend Testing Pages

### User Payment Pages
- **Payment Form:** http://localhost:3000/payment/[jobId]
- **Payment History:** http://localhost:3000/dashboard (payments section)

### Admin Payment Pages
- **Admin Dashboard:** http://localhost:3000/admin
- **Pending Payments:** http://localhost:3000/admin/payments
- **Payment Analytics:** http://localhost:3000/admin/analytics

## 🐛 Debug Tools

### API Test Page
- **Test API:** http://localhost:3000/test-api
- Test payment endpoints directly

### Database Check
```bash
# Check payments in database
curl http://localhost:5000/api/admin/payments -H "Authorization: Bearer ADMIN_TOKEN"
```

## 📋 Payment Status Flow

1. **Created** → Payment created when job is awarded
2. **Pending** → User submits UTR number
3. **Verified** → Admin verifies payment
4. **Completed** → Payment process finished
5. **Rejected** → Admin rejects payment

## 🎯 Test Scenarios

### Scenario 1: Successful Payment
1. Create job → Bid → Award → Submit payment → Admin verify ✅

### Scenario 2: Payment Rejection
1. Create job → Bid → Award → Submit payment → Admin reject ❌

### Scenario 3: Multiple Payments
1. Create multiple jobs and test payment queue

### Scenario 4: Payment History
1. Check payment history for users and admins

## 🔍 Common Issues

### Issue: "Payment not found"
- **Solution:** Make sure job is awarded before creating payment

### Issue: "Unauthorized"
- **Solution:** Check JWT token and user permissions

### Issue: "Invalid UTR"
- **Solution:** Use valid UTR format (alphanumeric)

## 📊 Expected Results

After successful testing, you should see:
- ✅ Payment created in database
- ✅ Payment status updates correctly
- ✅ Admin can verify/reject payments
- ✅ Payment history shows all transactions
- ✅ Users can track payment status
