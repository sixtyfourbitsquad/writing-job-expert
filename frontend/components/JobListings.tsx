'use client'

import { motion } from 'framer-motion'
import { Clock, DollarSign, MapPin, Briefcase } from 'lucide-react'
import Link from 'next/link'
import Button from './Button'

const JobListings = () => {
  const jobs = [
    {
      id: 1,
      title: 'React Native Mobile App Development',
      description: 'Looking for an experienced React Native developer to build a cross-platform mobile app for our e-commerce platform.',
      budget: '$2,000 - $5,000',
      deadline: '2 weeks',
      location: 'Remote',
      category: 'Mobile Development',
      skills: ['React Native', 'JavaScript', 'iOS', 'Android'],
      client: 'TechStart Inc.',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'UI/UX Design for SaaS Dashboard',
      description: 'Need a creative designer to redesign our SaaS dashboard with modern UI/UX principles and user-friendly interface.',
      budget: '$1,500 - $3,000',
      deadline: '3 weeks',
      location: 'Remote',
      category: 'Design',
      skills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems'],
      client: 'CloudSoft',
      posted: '1 day ago'
    },
    {
      id: 3,
      title: 'Backend API Development with Node.js',
      description: 'Seeking a backend developer to build RESTful APIs and integrate with third-party services for our web application.',
      budget: '$3,000 - $6,000',
      deadline: '4 weeks',
      location: 'Remote',
      category: 'Backend Development',
      skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
      client: 'DataFlow Solutions',
      posted: '3 days ago'
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
            Latest Job Opportunities
          </h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto">
            Discover exciting projects and start your next freelance journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg border border-dark-200 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-sm text-dark-500 mb-2">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {job.category}
                  </div>
                </div>
                <span className="text-xs text-dark-400 bg-dark-100 px-2 py-1 rounded-full">
                  {job.posted}
                </span>
              </div>

              <p className="text-dark-600 mb-4 line-clamp-3">
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
                  <span className="text-xs text-dark-500">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-dark-600">
                  <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                  <span className="font-semibold">{job.budget}</span>
                </div>
                <div className="flex items-center text-sm text-dark-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Deadline: {job.deadline}</span>
                </div>
                <div className="flex items-center text-sm text-dark-600">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-dark-500">
                  Posted by <span className="font-medium text-dark-700">{job.client}</span>
                </div>
                <Link href={`/jobs/${job.id}`}>
                  <Button size="sm">View Details</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/jobs">
            <Button size="lg">View All Jobs</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default JobListings
