'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown, ChevronDown, ChevronUp } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'

interface PricingPlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  isPopular: boolean
  icon: string
  color: string
}

interface FAQ {
  id: string
  question: string
  answer: string
}

const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPlans: PricingPlan[] = [
      {
        id: '1',
        name: 'Lite',
        price: 999,
        description: 'Perfect for individual writers and small projects',
        features: [
          'Up to 5 job postings per month',
          'Basic writer profiles',
          'Standard support',
          'Email notifications',
          'Basic analytics',
          'Mobile app access'
        ],
        isPopular: false,
        icon: 'Zap',
        color: 'primary'
      },
      {
        id: '2',
        name: 'Pro',
        price: 2999,
        originalPrice: 3999,
        description: 'Ideal for growing businesses and active writers',
        features: [
          'Unlimited job postings',
          'Advanced writer profiles',
          'Priority support',
          'Real-time notifications',
          'Advanced analytics',
          'Custom branding',
          'API access',
          'Bulk operations'
        ],
        isPopular: true,
        icon: 'Star',
        color: 'accent'
      },
      {
        id: '3',
        name: 'Lifetime',
        price: 9999,
        originalPrice: 14999,
        description: 'One-time payment for lifetime access to all features',
        features: [
          'Everything in Pro',
          'Lifetime updates',
          'Premium support',
          'Custom integrations',
          'White-label options',
          'Advanced reporting',
          'Dedicated account manager',
          'Custom features on request'
        ],
        isPopular: false,
        icon: 'Crown',
        color: 'secondary'
      }
    ]

    const mockFAQs: FAQ[] = [
      {
        id: '1',
        question: 'What payment methods do you accept?',
        answer: 'We accept UPI payments, credit/debit cards, and net banking. All payments are processed securely through our UPI gateway with manual verification for added security.'
      },
      {
        id: '2',
        question: 'Can I change my plan later?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.'
      },
      {
        id: '3',
        question: 'Is there a free trial available?',
        answer: 'We offer a 7-day free trial for the Pro plan. No credit card required, and you can cancel anytime during the trial period.'
      },
      {
        id: '4',
        question: 'What happens if I exceed my plan limits?',
        answer: 'If you exceed your plan limits, we\'ll notify you and offer options to upgrade or purchase additional credits. Your account won\'t be suspended without notice.'
      },
      {
        id: '5',
        question: 'Do you offer refunds?',
        answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team for a full refund.'
      },
      {
        id: '6',
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.'
      }
    ]

    setTimeout(() => {
      setPlans(mockPlans)
      setFaqs(mockFAQs)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-8 h-8" />
      case 'Star':
        return <Star className="w-8 h-8" />
      case 'Crown':
        return <Crown className="w-8 h-8" />
      default:
        return <Zap className="w-8 h-8" />
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-600 text-white'
      case 'accent':
        return 'bg-accent-600 text-white'
      case 'secondary':
        return 'bg-secondary-600 text-white'
      default:
        return 'bg-primary-600 text-white'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-secondary-900">Loading Pricing...</h2>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Select the perfect plan for your writing business. All plans include our core features with different levels of access.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${plan.isPopular ? 'md:-mt-4' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <Card className={`h-full ${plan.isPopular ? 'ring-2 ring-primary-600 shadow-2xl' : ''}`}>
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 ${getColorClasses(plan.color)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {getIcon(plan.icon)}
                    </div>
                    <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-secondary-600 mb-6">
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <div className="flex items-center justify-center">
                        <span className="text-4xl font-bold text-secondary-900">
                          ₹{plan.price.toLocaleString()}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-lg text-secondary-500 line-through ml-2">
                            ₹{plan.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="text-secondary-500 text-sm">
                        {plan.name === 'Lifetime' ? 'One-time payment' : 'per month'}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-secondary-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.isPopular ? 'bg-primary-600 hover:bg-primary-700' : ''}`}
                    variant={plan.isPopular ? 'primary' : 'outline'}
                  >
                    {plan.name === 'Lifetime' ? 'Get Lifetime Access' : 'Get Started'}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-secondary-600">
                Find answers to common questions about our pricing and plans
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-soft-200"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-soft-50 transition-colors"
                  >
                    <span className="font-semibold text-secondary-900">
                      {faq.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-secondary-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-secondary-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-secondary-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Pricing
