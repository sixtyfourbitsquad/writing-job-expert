'use client'

import { motion } from 'framer-motion'
import { Search, Handshake, CreditCard, Star } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Find Projects',
      description: 'Browse through thousands of available projects or post your own job requirements.',
      step: '01'
    },
    {
      icon: Handshake,
      title: 'Connect & Bid',
      description: 'Freelancers bid on projects, clients review proposals and select the best match.',
      step: '02'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'Make secure payments through our UPI gateway with manual verification.',
      step: '03'
    },
    {
      icon: Star,
      title: 'Complete & Review',
      description: 'Deliver quality work, get paid, and leave reviews for future opportunities.',
      step: '04'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto">
            Get started in just a few simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent transform translate-x-8" />
              )}

              <div className="relative z-10">
                {/* Step Number */}
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                  <span className="text-2xl font-bold text-primary-600">{step.step}</span>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300">
                  <step.icon className="w-10 h-10 text-primary-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-dark-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
