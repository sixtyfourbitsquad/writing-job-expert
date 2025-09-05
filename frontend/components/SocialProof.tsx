'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const SocialProof = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const companies = [
    { name: 'HubSpot', logo: 'H' },
    { name: 'Contentful', logo: 'C' },
    { name: 'Notion', logo: 'N' },
    { name: 'Figma', logo: 'F' },
    { name: 'Stripe', logo: 'S' },
    { name: 'Vercel', logo: 'V' },
    { name: 'Linear', logo: 'L' },
    { name: 'GitHub', logo: 'G' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % companies.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [companies.length])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-semibold text-secondary-600 mb-8">
            Trusted by leading companies worldwide
          </h2>
          
          <div className="relative overflow-hidden">
            <motion.div
              className="flex space-x-12 items-center justify-center"
              animate={{
                x: [0, -200, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {[...companies, ...companies].map((company, index) => (
                <motion.div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center w-24 h-16"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-secondary-700">
                      {company.logo}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SocialProof
