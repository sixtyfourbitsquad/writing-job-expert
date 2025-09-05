'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PenTool, Building2, CheckCircle, Star, Users, Briefcase, Award } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'

const Register = () => {
  const [selectedType, setSelectedType] = useState<'writer' | 'business' | null>(null)

  const writerFeatures = [
    'Find high-paying writing jobs',
    'Build your professional portfolio',
    'Connect with top clients',
    'Get paid securely via UPI',
    'Access exclusive writing resources',
    'Join our writer community'
  ]

  const businessFeatures = [
    'Post unlimited writing jobs',
    'Access skilled writers',
    'Manage projects easily',
    'Secure payment processing',
    'Real-time communication',
    'Quality assurance system'
  ]

  const writerStats = [
    { label: 'Active Writers', value: '5,000+' },
    { label: 'Jobs Posted', value: '2,000+' },
    { label: 'Success Rate', value: '99%' }
  ]

  const businessStats = [
    { label: 'Happy Clients', value: '1,500+' },
    { label: 'Projects Completed', value: '5,000+' },
    { label: 'Satisfaction Rate', value: '98%' }
  ]

  if (selectedType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <button
                onClick={() => setSelectedType(null)}
                className="text-primary-600 hover:text-primary-700 font-medium mb-4"
              >
                ← Back to selection
              </button>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                {selectedType === 'writer' ? 'Join as a Writer' : 'Join as a Business'}
              </h1>
              <p className="text-lg text-secondary-600">
                {selectedType === 'writer' 
                  ? 'Create your writer account and start finding amazing writing opportunities'
                  : 'Create your business account and start hiring talented writers'
                }
              </p>
            </motion.div>

            <Card className="max-w-2xl mx-auto">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Create a strong password"
                  />
                </div>

                {selectedType === 'writer' && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Writing Specialization
                    </label>
                    <select className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="">Select your specialization</option>
                      <option value="content-writing">Content Writing</option>
                      <option value="technical-writing">Technical Writing</option>
                      <option value="creative-writing">Creative Writing</option>
                      <option value="business-writing">Business Writing</option>
                      <option value="academic-writing">Academic Writing</option>
                      <option value="marketing-copy">Marketing Copy</option>
                    </select>
                  </div>
                )}

                {selectedType === 'business' && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>
                )}

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-soft-300 rounded"
                  />
                  <label className="ml-2 text-sm text-secondary-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button type="submit" className="w-full">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="text-center">
                  <p className="text-secondary-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </Card>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Join Writing Job Expert
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Choose how you'd like to join our writing marketplace
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Writer Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedType('writer')}>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                    <PenTool className="w-10 h-10 text-primary-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                    For Writers
                  </h2>
                  <p className="text-lg text-secondary-600 mb-6">
                    Join as a writer and start earning from your writing skills
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {writerFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                      <span className="text-secondary-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {writerStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-secondary-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full group-hover:bg-primary-700">
                  Become a Member
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            </motion.div>

            {/* Business Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedType('business')}>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-200 transition-colors">
                    <Building2 className="w-10 h-10 text-accent-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                    For Business
                  </h2>
                  <p className="text-lg text-secondary-600 mb-6">
                    Join as a business and start hiring talented writers
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {businessFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-accent-600 mr-3 flex-shrink-0" />
                      <span className="text-secondary-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {businessStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-secondary-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-accent-600 hover:bg-accent-700">
                  Start Hiring Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-secondary-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Register