'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Star, Eye, Award, Clock } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'

interface Writer {
  id: string
  name: string
  avatar: string
  specialization: string
  location: string
  rating: number
  completedJobs: number
  hourlyRate: number
  skills: string[]
  bio: string
  isVerified: boolean
  responseTime: string
}

const Writers = () => {
  const [writers, setWriters] = useState<Writer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockWriters: Writer[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/80/80',
        specialization: 'Content Writing',
        location: 'Remote',
        rating: 4.9,
        completedJobs: 150,
        hourlyRate: 25,
        skills: ['Blog Writing', 'SEO Content', 'Copywriting', 'Technical Writing'],
        bio: 'Professional content writer with 5+ years of experience in creating engaging, SEO-optimized content for various industries.',
        isVerified: true,
        responseTime: '2 hours'
      },
      {
        id: '2',
        name: 'Michael Chen',
        avatar: '/api/placeholder/80/80',
        specialization: 'Technical Writing',
        location: 'New York, USA',
        rating: 4.8,
        completedJobs: 89,
        hourlyRate: 45,
        skills: ['API Documentation', 'User Manuals', 'Technical Blogs', 'White Papers'],
        bio: 'Expert technical writer specializing in software documentation and complex technical content.',
        isVerified: true,
        responseTime: '4 hours'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        avatar: '/api/placeholder/80/80',
        specialization: 'Creative Writing',
        location: 'Los Angeles, USA',
        rating: 4.9,
        completedJobs: 200,
        hourlyRate: 30,
        skills: ['Fiction', 'Screenwriting', 'Creative Nonfiction', 'Poetry'],
        bio: 'Award-winning creative writer with published works in multiple genres and formats.',
        isVerified: true,
        responseTime: '1 hour'
      },
      {
        id: '4',
        name: 'David Kumar',
        avatar: '/api/placeholder/80/80',
        specialization: 'Business Writing',
        location: 'Mumbai, India',
        rating: 4.7,
        completedJobs: 120,
        hourlyRate: 20,
        skills: ['Proposals', 'Reports', 'Presentations', 'Business Plans'],
        bio: 'Business writing specialist with expertise in corporate communications and strategic documents.',
        isVerified: true,
        responseTime: '3 hours'
      },
      {
        id: '5',
        name: 'Lisa Thompson',
        avatar: '/api/placeholder/80/80',
        specialization: 'Academic Writing',
        location: 'London, UK',
        rating: 4.8,
        completedJobs: 95,
        hourlyRate: 35,
        skills: ['Research Papers', 'Theses', 'Dissertations', 'Academic Articles'],
        bio: 'PhD holder with extensive experience in academic writing and research methodology.',
        isVerified: true,
        responseTime: '6 hours'
      },
      {
        id: '6',
        name: 'James Wilson',
        avatar: '/api/placeholder/80/80',
        specialization: 'Marketing Copy',
        location: 'Remote',
        rating: 4.9,
        completedJobs: 180,
        hourlyRate: 40,
        skills: ['Ad Copy', 'Email Marketing', 'Social Media', 'Sales Pages'],
        bio: 'Marketing copywriter with proven track record of increasing conversion rates and engagement.',
        isVerified: true,
        responseTime: '2 hours'
      }
    ]

    setTimeout(() => {
      setWriters(mockWriters)
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

  const locations = [
    'All Locations',
    'Remote',
    'New York, USA',
    'Los Angeles, USA',
    'Mumbai, India',
    'London, UK'
  ]

  const filteredWriters = writers.filter(writer => {
    const matchesSearch = writer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         writer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         writer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || writer.specialization === selectedCategory
    const matchesLocation = selectedLocation === 'all' || writer.location === selectedLocation

    return matchesSearch && matchesCategory && matchesLocation
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-secondary-900">Loading Writers...</h2>
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
              Writers for Hire
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Discover talented writers across various specializations. Find the perfect match for your writing project.
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
                  placeholder="Search by name, skills, or specialization..."
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

              {/* Location Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location === 'All Locations' ? 'all' : location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-secondary-600">
              Showing {filteredWriters.length} of {writers.length} writers
            </p>
          </div>

          {/* Writers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWriters.map((writer, index) => (
              <motion.div
                key={writer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={writer.avatar}
                        alt={writer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {writer.isVerified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                          <Award className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                        {writer.name}
                      </h3>
                      <p className="text-primary-600 font-medium mb-1">
                        {writer.specialization}
                      </p>
                      <div className="flex items-center text-secondary-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {writer.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                    {writer.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {writer.skills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {writer.skills.length > 3 && (
                      <span className="px-3 py-1 bg-soft-100 text-secondary-600 text-xs rounded-full">
                        +{writer.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-secondary-900 font-semibold">
                        {writer.rating}
                      </span>
                      <span className="text-secondary-500 text-sm ml-1">
                        ({writer.completedJobs} jobs)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-secondary-900">
                        ₹{writer.hourlyRate}/hr
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Responds in {writer.responseTime}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredWriters.length === 0 && (
            <div className="text-center py-12">
              <div className="text-secondary-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No writers found
              </h3>
              <p className="text-secondary-600">
                Try adjusting your search criteria or browse all writers.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Writers
