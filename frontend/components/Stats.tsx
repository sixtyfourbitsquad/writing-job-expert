'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Stats = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const stats = [
    { number: '10,000+', label: 'Active Freelancers', suffix: '+' },
    { number: '5,000+', label: 'Projects Completed', suffix: '+' },
    { number: '98%', label: 'Client Satisfaction', suffix: '%' },
    { number: '50+', label: 'Countries Served', suffix: '+' }
  ]

  return (
    <section ref={ref} className="py-16 bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                className="text-4xl md:text-5xl font-bold text-primary-400 mb-2"
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-300 text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
