'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  CreditCard, 
  MessageCircle, 
  Star, 
  Clock, 
  Users,
  Briefcase,
  Award,
  Zap
} from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your payments are protected with our secure UPI gateway and manual verification system.',
    },
    {
      icon: MessageCircle,
      title: 'Real-time Communication',
      description: 'Communicate instantly with writers and clients through our integrated chat system.',
    },
    {
      icon: Star,
      title: 'Quality Writing',
      description: 'Rate and review system ensures only the best writers and writing projects on our platform.',
    },
    {
      icon: Clock,
      title: 'Fast Turnaround',
      description: 'Find and hire writers quickly with our streamlined bidding and selection process.',
    },
    {
      icon: Users,
      title: 'Expert Writers',
      description: 'Access to thousands of verified writers across various writing niches and specializations.',
    },
    {
      icon: Award,
      title: 'Guaranteed Quality',
      description: 'Our platform ensures high-quality writing through our comprehensive review system.',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Why Choose Writing Job Expert?
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            We provide everything you need to succeed in the writing marketplace
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
