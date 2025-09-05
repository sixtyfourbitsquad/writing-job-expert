'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  CreditCard, 
  Users, 
  FileText, 
  Settings, 
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Edit,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'

interface Payment {
  id: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  type: 'job_posting' | 'subscription'
  status: 'processing' | 'success' | 'failed'
  utrNumber?: string
  createdAt: string
  updatedAt: string
}

interface AdminSettings {
  upiId: string
  qrCodeUrl: string
  postJobPrice: number
  subscriptionPrices: {
    lite: number
    pro: number
    lifetime: number
  }
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('payments')
  const [payments, setPayments] = useState<Payment[]>([])
  const [settings, setSettings] = useState<AdminSettings>({
    upiId: '',
    qrCodeUrl: '',
    postJobPrice: 59,
    subscriptionPrices: {
      lite: 999,
      pro: 2999,
      lifetime: 9999
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        amount: 59,
        type: 'job_posting',
        status: 'processing',
        utrNumber: 'UPI123456789',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        amount: 2999,
        type: 'subscription',
        status: 'success',
        utrNumber: 'UPI987654321',
        createdAt: '2024-01-14T15:45:00Z',
        updatedAt: '2024-01-14T16:00:00Z'
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Mike Johnson',
        userEmail: 'mike@example.com',
        amount: 59,
        type: 'job_posting',
        status: 'failed',
        utrNumber: 'UPI555666777',
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:30:00Z'
      }
    ]

    setTimeout(() => {
      setPayments(mockPayments)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would verify password with backend
    if (password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert('Invalid password')
    }
  }

  const updatePaymentStatus = (paymentId: string, status: 'success' | 'failed') => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status, updatedAt: new Date().toISOString() }
        : payment
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Admin Login
            </h1>
            <p className="text-secondary-600">
              Enter admin password to access the panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Login to Admin Panel
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-secondary-900">Loading Admin Panel...</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-secondary-600">
              Manage payments, content, and platform settings
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-soft-50'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Payment Management
                  </h2>
                  <div className="text-sm text-secondary-600">
                    Total: {payments.length} payments
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-soft-200">
                        <th className="text-left py-3 px-4 font-medium text-secondary-700">User</th>
                        <th className="text-left py-3 px-4 font-medium text-secondary-700">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-secondary-700">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-secondary-700">UTR Number</th>
                        <th className="text-left py-3 px-4 font-medium text-secondary-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-secondary-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-secondary-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b border-soft-100 hover:bg-soft-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-secondary-900">{payment.userName}</div>
                              <div className="text-sm text-secondary-500">{payment.userEmail}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-secondary-900">
                              ₹{payment.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                              {payment.type === 'job_posting' ? 'Job Posting' : 'Subscription'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm text-secondary-600">
                              {payment.utrNumber || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {getStatusIcon(payment.status)}
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-secondary-600">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            {payment.status === 'processing' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => updatePaymentStatus(payment.id, 'success')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updatePaymentStatus(payment.id, 'failed')}
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                    UPI Payment Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={settings.upiId}
                        onChange={(e) => setSettings(prev => ({ ...prev, upiId: e.target.value }))}
                        className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="admin@paytm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        QR Code URL
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={settings.qrCodeUrl}
                          onChange={(e) => setSettings(prev => ({ ...prev, qrCodeUrl: e.target.value }))}
                          className="flex-1 px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://example.com/qr-code.png"
                        />
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save UPI Settings
                    </Button>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                    Pricing Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Post Job Price (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.postJobPrice}
                        onChange={(e) => setSettings(prev => ({ ...prev, postJobPrice: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Lite Plan (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.subscriptionPrices.lite}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          subscriptionPrices: { ...prev.subscriptionPrices, lite: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Pro Plan (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.subscriptionPrices.pro}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          subscriptionPrices: { ...prev.subscriptionPrices, pro: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Lifetime Plan (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.subscriptionPrices.lifetime}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          subscriptionPrices: { ...prev.subscriptionPrices, lifetime: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <Button className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Pricing Settings
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Content Management
                </h2>
                <p className="text-secondary-600">
                  Manage FAQ content, pricing descriptions, and other dynamic content.
                </p>
                <div className="mt-4">
                  <Button>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit FAQ Content
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Analytics Dashboard
                </h2>
                <p className="text-secondary-600">
                  View platform statistics, user metrics, and revenue analytics.
                </p>
                <div className="mt-4">
                  <Button>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminPanel