'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

const Card = ({ children, className = '', hover = true, onClick }: CardProps) => {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-dark-200 p-6 transition-all duration-200 ${
        hover ? 'hover:shadow-xl' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default Card
