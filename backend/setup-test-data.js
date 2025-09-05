const axios = require('axios')

const API_URL = 'http://localhost:5000'

async function setupTestData() {
  try {
    console.log('🚀 Setting up test data for payment testing...\n')

    // 1. Clear existing data
    console.log('1. Clearing existing data...')
    await axios.post(`${API_URL}/api/admin/clear-db`)
    console.log('✅ Database cleared\n')

    // 2. Create test users
    console.log('2. Creating test users...')
    
    const clientResponse = await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Test Client',
      email: 'client@test.com',
      password: 'password123',
      role: 'client'
    })
    console.log('✅ Client created:', clientResponse.data.user.email)

    const freelancerResponse = await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Test Freelancer',
      email: 'freelancer@test.com',
      password: 'password123',
      role: 'freelancer'
    })
    console.log('✅ Freelancer created:', freelancerResponse.data.user.email)

    const adminResponse = await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'client'
    })
    console.log('✅ Admin created:', adminResponse.data.user.email)

    // 3. Make admin user an admin
    console.log('\n3. Making user admin...')
    console.log('Admin user ID:', adminResponse.data.user.id)
    const makeAdminResponse = await axios.post(`${API_URL}/api/admin/make-admin`, {
      userId: adminResponse.data.user.id
    })
    console.log('✅ Admin privileges granted:', makeAdminResponse.data.message)

    // 4. Create a test job
    console.log('4. Creating test job...')
    const jobResponse = await axios.post(`${API_URL}/api/jobs`, {
      title: 'Test Payment Job',
      description: 'This is a test job for payment testing. Please complete this project with high quality and attention to detail.',
      budget: { min: 500, max: 1000 },
      category: 'Web Development',
      deadline: '2024-12-31',
      skills: ['React', 'Node.js', 'MongoDB']
    }, {
      headers: { Authorization: `Bearer ${clientResponse.data.token}` }
    })
    console.log('✅ Job created:', jobResponse.data.job.title)

    // 5. Create a bid
    console.log('\n5. Creating bid...')
    console.log('Job ID:', jobResponse.data.job.id)
    const bidResponse = await axios.post(`${API_URL}/api/bids`, {
      jobId: jobResponse.data.job.id,
      amount: 800,
      message: 'I can complete this job for $800. I have 5 years experience in web development and can deliver high-quality results.',
      deliveryTime: 14
    }, {
      headers: { Authorization: `Bearer ${freelancerResponse.data.token}` }
    })
    console.log('✅ Bid created:', bidResponse.data.bid.amount)

    // 6. Accept the bid
    console.log('\n6. Accepting bid...')
    await axios.put(`${API_URL}/api/jobs/${jobResponse.data.job.id}/award`, {
      bidId: bidResponse.data.bid.id
    }, {
      headers: { Authorization: `Bearer ${clientResponse.data.token}` }
    })
    console.log('✅ Bid accepted')

    console.log('\n🎉 Test data setup complete!')
    console.log('\n📋 Test Accounts:')
    console.log('Client: client@test.com / password123')
    console.log('Freelancer: freelancer@test.com / password123')
    console.log('Admin: admin@test.com / password123')
    console.log('\n🔗 Test URLs:')
    console.log('Frontend: http://localhost:3000')
    console.log('Login: http://localhost:3000/login')
    console.log('Admin Panel: http://localhost:3000/admin')
    console.log('API Test: http://localhost:3000/test-api')

  } catch (error) {
    console.error('❌ Error setting up test data:', error.response?.data || error.message)
  }
}

setupTestData()
