'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase,
  Star,
  Users
} from 'lucide-react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Job {
  id: string
  title: string
  description: string
  budget: {
    min: number
    max: number
    type: string
  }
  deadline: string
  location: string
  category: string
  skills: string[]
  client: {
    name: string
    profilePicture: string
    rating: number
  }
  posted: string
  proposals: number
  views: number
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minBudget: '',
    maxBudget: '',
    location: ''
  })

  useEffect(() => {
    // Fetch jobs from API
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      // This would be an actual API call
      // const response = await axios.get('/api/jobs', { params: filters })
      // setJobs(response.data.jobs)
      
      // Mock data for now
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Content Writer for Tech Blog',
          description: 'Looking for an experienced content writer to create engaging blog posts about technology trends, software development, and digital innovation.',
          budget: { min: 500, max: 1200, type: 'per-article' },
          deadline: '2024-02-15',
          location: 'Remote',
          category: 'Content Writing',
          skills: ['Blog Writing', 'Tech Writing', 'SEO', 'Content Strategy'],
          client: { name: 'TechBlog Pro', profilePicture: '', rating: 4.8 },
          posted: '2 days ago',
          proposals: 12,
          views: 45
        },
        {
          id: '2',
          title: 'Technical Documentation Writer',
          description: 'Need a skilled technical writer to create comprehensive documentation for our API and software products.',
          budget: { min: 1500, max: 3000, type: 'fixed' },
          deadline: '2024-02-20',
          location: 'Remote',
          category: 'Technical Writing',
          skills: ['Technical Writing', 'API Documentation', 'User Manuals', 'Software Docs'],
          client: { name: 'DevTools Inc.', profilePicture: '', rating: 4.9 },
          posted: '1 day ago',
          proposals: 8,
          views: 32
        },
        {
          id: '3',
          title: 'Creative Copywriter for Marketing Campaigns',
          description: 'Seeking a creative copywriter to develop compelling marketing copy for our digital advertising campaigns and social media content.',
          budget: { min: 800, max: 2000, type: 'project' },
          deadline: '2024-02-25',
          location: 'Remote',
          category: 'Marketing Copy',
          skills: ['Copywriting', 'Marketing', 'Social Media', 'Ad Copy'],
          client: { name: 'Creative Agency', profilePicture: '', rating: 4.7 },
          posted: '3 days ago',
          proposals: 15,
          views: 67
        },
        {
          id: '4',
          title: 'Academic Research Paper Writer',
          description: 'Looking for an academic writer to help with research papers in the field of computer science and artificial intelligence.',
          budget: { min: 2000, max: 5000, type: 'fixed' },
          deadline: '2024-03-01',
          location: 'Remote',
          category: 'Academic Writing',
          skills: ['Academic Writing', 'Research', 'Computer Science', 'Citations'],
          client: { name: 'University Research', profilePicture: '', rating: 4.9 },
          posted: '4 days ago',
          proposals: 6,
          views: 28
        },
        {
          id: '5',
          title: 'Business Proposal Writer',
          description: 'Need a professional business writer to create compelling proposals for our consulting services and client presentations.',
          budget: { min: 1000, max: 2500, type: 'project' },
          deadline: '2024-02-18',
          location: 'Remote',
          category: 'Business Writing',
          skills: ['Business Writing', 'Proposals', 'Presentations', 'Corporate'],
          client: { name: 'Consulting Firm', profilePicture: '', rating: 4.6 },
          posted: '1 day ago',
          proposals: 9,
          views: 41
        },
        {
          id: '6',
          title: 'Creative Story Writer for Children\'s Books',
          description: 'Seeking a creative writer to develop engaging children\'s stories and educational content for our publishing house.',
          budget: { min: 600, max: 1500, type: 'per-story' },
          deadline: '2024-02-28',
          location: 'Remote',
          category: 'Creative Writing',
          skills: ['Creative Writing', 'Children\'s Books', 'Storytelling', 'Education'],
          client: { name: 'Kids Publishing', profilePicture: '', rating: 4.8 },
          posted: '2 days ago',
          proposals: 11,
          views: 38
        }
      ]
      setJobs(mockJobs)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const categories = [
    'All Categories',
    'Content Writing',
    'Technical Writing',
    'Creative Writing',
    'Business Writing',
    'Academic Writing',
    'Marketing Copy',
    'Copywriting'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-50 to-accent-50">
      <Header />
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Open Writing Jobs
          </h1>
          <p className="text-secondary-600">
            Discover amazing writing opportunities from top clients worldwide
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search writing jobs, skills, or keywords..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  icon={<Search className="w-5 h-5 text-secondary-400" />}
                />
              </div>
              
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All Categories' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>

              <Button className="flex items-center justify-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Budget Range */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Min Budget (₹)"
                type="number"
                value={filters.minBudget}
                onChange={(e) => handleFilterChange('minBudget', e.target.value)}
              />
              <Input
                placeholder="Max Budget (₹)"
                type="number"
                value={filters.maxBudget}
                onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
              />
            </div>
          </Card>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-secondary-600">
            Showing {jobs.length} writing jobs
          </p>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </motion.div>
            ))
          ) : (
            jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center text-sm text-secondary-500 mb-2">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.category}
                      </div>
                    </div>
                    <span className="text-xs text-secondary-400 bg-soft-100 px-2 py-1 rounded-full">
                      {job.posted}
                    </span>
                  </div>

                  <p className="text-secondary-600 mb-4 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="text-xs text-secondary-500">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-secondary-600">
                      <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                      <span className="font-semibold">
                        ₹{job.budget.min.toLocaleString()} - ₹{job.budget.max.toLocaleString()}
                      </span>
                      <span className="text-secondary-500 ml-1">({job.budget.type})</span>
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold text-primary-600">
                          {job.client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900">{job.client.name}</p>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-xs text-secondary-500">{job.client.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-secondary-500">
                      <p>{job.proposals} proposals</p>
                      <p>{job.views} views</p>
                    </div>
                  </div>

                  <Button className="w-full">
                    View Details
                  </Button>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        {!loading && jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </motion.div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
