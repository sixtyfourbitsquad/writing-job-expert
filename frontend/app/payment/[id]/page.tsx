'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { 
  CreditCard, 
  QrCode, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Copy,
  RefreshCw,
  ArrowLeft
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'

interface PaymentDetails {
  id: string
  amount: number
  type: 'job_posting' | 'subscription'
  description: string
  upiId: string
  qrCodeUrl: string
  status: 'pending' | 'processing' | 'success' | 'failed'
  createdAt: string
}

const PaymentPage = () => {
  const params = useParams()
  const router = useRouter()
  const [payment, setPayment] = useState<PaymentDetails | null>(null)
  const [utrNumber, setUtrNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // Mock payment data - in real app, this would come from API
  useEffect(() => {
    const mockPayment: PaymentDetails = {
      id: params.id as string,
      amount: 59,
      type: 'job_posting',
      description: 'Job Posting Fee',
      upiId: 'admin@paytm',
      qrCodeUrl: '/api/placeholder/300/300',
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    setTimeout(() => {
      setPayment(mockPayment)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!utrNumber.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setPayment(prev => prev ? { ...prev, status: 'processing' } : null)
      setIsSubmitting(false)
      // Show success message
    }, 2000)
  }

  const copyUpiId = () => {
    if (payment?.upiId) {
      navigator.clipboard.writeText(payment.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-500" />
      case 'processing':
        return <Clock className="w-6 h-6 text-yellow-500" />
      default:
        return <Clock className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'success':
        return 'Payment successful! Your job has been posted.'
      case 'failed':
        return 'Payment failed. Please try again or contact support.'
      case 'processing':
        return 'Payment is being verified. You will be notified once confirmed.'
      default:
        return 'Please complete the payment to proceed.'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-secondary-900">Loading Payment...</h2>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">Payment Not Found</h2>
            <p className="text-secondary-600 mb-4">The payment you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Complete Payment
            </h1>
            <p className="text-secondary-600">
              Pay securely using UPI to complete your transaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                    Payment Details
                  </h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-soft-200">
                    <span className="text-secondary-600">Description:</span>
                    <span className="font-semibold text-secondary-900">{payment.description}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-soft-200">
                    <span className="text-secondary-600">Amount:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{payment.amount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-soft-200">
                    <span className="text-secondary-600">Payment ID:</span>
                    <span className="font-mono text-sm text-secondary-500">{payment.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3">
                    <span className="text-secondary-600">Status:</span>
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <span className={`ml-2 px-3 py-1 text-sm rounded-full ${
                        payment.status === 'success' ? 'bg-green-100 text-green-800' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                        payment.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-soft-50 rounded-lg p-4">
                  <p className="text-sm text-secondary-600 text-center">
                    {getStatusMessage(payment.status)}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* UPI Payment */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-accent-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                    UPI Payment
                  </h2>
                  <p className="text-secondary-600">
                    Scan QR code or use UPI ID to pay
                  </p>
                </div>

                {payment.status === 'pending' && (
                  <>
                    {/* QR Code */}
                    <div className="text-center mb-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-dashed border-soft-300 mb-4">
                        <img
                          src={payment.qrCodeUrl}
                          alt="UPI QR Code"
                          className="w-48 h-48 mx-auto"
                        />
                      </div>
                      <p className="text-sm text-secondary-500">
                        Scan this QR code with any UPI app
                      </p>
                    </div>

                    {/* UPI ID */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Or use UPI ID:
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={payment.upiId}
                          readOnly
                          className="flex-1 px-4 py-3 border border-soft-300 rounded-lg bg-soft-50 font-mono"
                        />
                        <Button
                          onClick={copyUpiId}
                          variant="outline"
                          size="sm"
                        >
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* UTR Submission Form */}
                    <form onSubmit={handleSubmitUtr} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          UTR Number (After Payment)
                        </label>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="Enter UTR number from your UPI app"
                          className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                        <p className="text-xs text-secondary-500 mt-1">
                          You can find the UTR number in your UPI app after successful payment
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !utrNumber.trim()}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit UTR & Complete Payment'
                        )}
                      </Button>
                    </form>
                  </>
                )}

                {payment.status === 'processing' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      Payment Under Review
                    </h3>
                    <p className="text-secondary-600">
                      Your payment is being verified. You will receive a confirmation email once approved.
                    </p>
                  </div>
                )}

                {payment.status === 'success' && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      Payment Successful!
                    </h3>
                    <p className="text-secondary-600 mb-4">
                      Your payment has been confirmed and your job has been posted.
                    </p>
                    <Button onClick={() => router.push('/jobs')}>
                      View Your Jobs
                    </Button>
                  </div>
                )}

                {payment.status === 'failed' && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      Payment Failed
                    </h3>
                    <p className="text-secondary-600 mb-4">
                      There was an issue with your payment. Please try again.
                    </p>
                    <Button onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Need Help?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary-600">
                <div>
                  <h4 className="font-medium text-secondary-900 mb-2">Payment Issues:</h4>
                  <p>If you're having trouble with payment, please contact our support team at support@writingjobexpert.com</p>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900 mb-2">UTR Number:</h4>
                  <p>UTR (Unique Transaction Reference) number is provided by your UPI app after successful payment.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PaymentPage