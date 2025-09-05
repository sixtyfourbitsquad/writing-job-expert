'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star, Clock, User, Tag, Calendar } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'

interface Service {
  id: string
  title: string
  provider: string
  providerAvatar: string
  price: number
  rating: number
  reviews: number
  category: string
  description: string
  deliveryTime: string
  tags: string[]
  isVerified: boolean
  createdAt: string
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockServices: Service[] = [
      {
        id: '1',
        title: 'Professional Blog Writing Services',
        provider: 'Sarah Johnson',
        providerAvatar: '/api/placeholder/40/40',
        price: 500,
        rating: 4.9,
        reviews: 127,
        category: 'Content Writing',
        description: 'High-quality blog posts that engage your audience and drive traffic. SEO-optimized content tailored to your brand voice.',
        deliveryTime: '3-5 days',
        tags: ['Blog Writing', 'SEO', 'Content Marketing'],
        isVerified: true,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        title: 'Technical Documentation Writing',
        provider: 'Michael Chen',
        providerAvatar: '/api/placeholder/40/40',
        price: 1200,
        rating: 4.8,
        reviews: 89,
        category: 'Technical Writing',
        description: 'Comprehensive technical documentation including user manuals, API docs, and technical guides.',
        deliveryTime: '7-10 days',
        tags: ['Technical Writing', 'Documentation', 'API Docs'],
        isVerified: true,
        createdAt: '2024-01-14'
      },
      {
        id: '3',
        title: 'Creative Story Writing',
        provider: 'Emily Rodriguez',
        providerAvatar: '/api/placeholder/40/40',
        price: 800,
        rating: 4.9,
        reviews: 156,
        category: 'Creative Writing',
        description: 'Original creative stories, short stories, and narrative content for various platforms and audiences.',
        deliveryTime: '5-7 days',
        tags: ['Creative Writing', 'Fiction', 'Storytelling'],
        isVerified: true,
        createdAt: '2024-01-13'
      },
      {
        id: '4',
        title: 'Business Proposal Writing',
        provider: 'David Kumar',
        providerAvatar: '/api/placeholder/40/40',
        price: 1500,
        rating: 4.7,
        reviews: 92,
        category: 'Business Writing',
        description: 'Professional business proposals that win clients and secure funding. Persuasive and well-structured.',
        deliveryTime: '5-8 days',
        tags: ['Business Writing', 'Proposals', 'Professional'],
        isVerified: true,
        createdAt: '2024-01-12'
      },
      {
        id: '5',
        title: 'Academic Research Paper Writing',
        provider: 'Lisa Thompson',
        providerAvatar: '/api/placeholder/40/40',
        price: 2000,
        rating: 4.8,
        reviews: 78,
        category: 'Academic Writing',
        description: 'Thorough academic research papers with proper citations and methodology. PhD-level quality.',
        deliveryTime: '10-14 days',
        tags: ['Academic Writing', 'Research', 'Citations'],
        isVerified: true,
        createdAt: '2024-01-11'
      },
      {
        id: '6',
        title: 'Marketing Copy & Ad Writing',
        provider: 'James Wilson',
        providerAvatar: '/api/placeholder/40/40',
        price: 600,
        rating: 4.9,
        reviews: 203,
        category: 'Marketing Copy',
        description: 'Compelling marketing copy that converts. Ad copy, email campaigns, and sales pages that drive results.',
        deliveryTime: '2-4 days',
        tags: ['Marketing', 'Ad Copy', 'Sales Copy'],
        isVerified: true,
        createdAt: '2024-01-10'
      },
      {
        id: '7',
        title: 'Website Content Writing',
        provider: 'Sarah Johnson',
        providerAvatar: '/api/placeholder/40/40',
        price: 400,
        rating: 4.8,
        reviews: 145,
        category: 'Content Writing',
        description: 'Engaging website content including homepage copy, about pages, and service descriptions.',
        deliveryTime: '2-3 days',
        tags: ['Web Content', 'Copywriting', 'SEO'],
        isVerified: true,
        createdAt: '2024-01-09'
      },
      {
        id: '8',
        title: 'Social Media Content Creation',
        provider: 'Emily Rodriguez',
        providerAvatar: '/api/placeholder/40/40',
        price: 300,
        rating: 4.9,
        reviews: 167,
        category: 'Content Writing',
        description: 'Engaging social media posts and captions that boost engagement and brand awareness.',
        deliveryTime: '1-2 days',
        tags: ['Social Media', 'Content Creation', 'Engagement'],
        isVerified: true,
        createdAt: '2024-01-08'
      }
    ]

    setTimeout(() => {
      setServices(mockServices)
      setIsLoading(false)
    }, 1000)
  }, [])

  const categories = [
    'All Categories',
    'Content Writing',
    'Technical Writing',
    'Creative Writing',
    'Business Writing',
    'Academic Writing',
    'Marketing Copy'
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  const filteredAndSortedServices = services
    .filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-secondary-900">Loading Services...</h2>
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
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Writing Services
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Discover professional writing services from verified writers. Find the perfect service for your writing needs.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services, keywords, or providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All Categories' ? 'all' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="lg:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-secondary-600">
              Showing {filteredAndSortedServices.length} of {services.length} services
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={service.providerAvatar}
                        alt={service.provider}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-secondary-900">
                          {service.provider}
                        </h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-secondary-600">
                            {service.rating} ({service.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {service.category}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-secondary-900 mb-3 line-clamp-2">
                    {service.title}
                  </h2>

                  <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-soft-100 text-secondary-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-secondary-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.deliveryTime}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-secondary-900">
                        ₹{service.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-secondary-500">
                        Starting price
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    View Service Details
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAndSortedServices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-secondary-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No services found
              </h3>
              <p className="text-secondary-600">
                Try adjusting your search criteria or browse all services.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Services
