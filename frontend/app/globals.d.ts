// Global type definitions for the FreelanceHub application

export interface User {
  id: string
  name: string
  email: string
  role: 'client' | 'freelancer' | 'admin'
  profile?: {
    bio?: string
    skills?: string[]
    portfolio?: PortfolioItem[]
    profilePicture?: string
    location?: string
    hourlyRate?: number
    availability?: 'available' | 'busy' | 'unavailable'
  }
  isActive: boolean
  isVerified: boolean
  rating: number
  totalReviews: number
  earnings: number
  completedJobs: number
}

export interface PortfolioItem {
  title: string
  description: string
  image: string
  url: string
}

export interface Job {
  id: string
  title: string
  description: string
  clientId: string
  freelancerId?: string
  category: string
  skills: string[]
  budget: {
    min: number
    max: number
    type: 'fixed' | 'hourly'
  }
  deadline: string
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  location: string
  attachments?: Attachment[]
  bids: string[]
  selectedBid?: string
  isUrgent: boolean
  isFeatured: boolean
  views: number
  proposals: number
  createdAt: string
  updatedAt: string
}

export interface Bid {
  id: string
  jobId: string
  freelancerId: string
  amount: number
  message: string
  deliveryTime: number
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  attachments?: Attachment[]
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  userId: string
  jobId: string
  amount: number
  currency: string
  paymentMethod: 'upi' | 'bank_transfer' | 'wallet'
  upiId: string
  qrCode: string
  utrNumber?: string
  status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded'
  transactionId?: string
  adminNotes?: string
  processedBy?: string
  processedAt?: string
  failureReason?: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  roomId: string
  senderId: string
  receiverId: string
  content: string
  messageType: 'text' | 'image' | 'file' | 'system'
  files?: Attachment[]
  isRead: boolean
  readAt?: string
  isEdited: boolean
  editedAt?: string
  replyTo?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  jobId: string
  clientId: string
  freelancerId: string
  rating: number
  feedback: string
  categories: {
    communication: number
    quality: number
    timeliness: number
    professionalism: number
  }
  isPublic: boolean
  response?: {
    content: string
    createdAt: string
  }
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  filename: string
  originalName: string
  url: string
  size: number
  type: string
}

export interface ApiResponse<T> {
  message: string
  data?: T
  error?: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

export interface DashboardStats {
  totalJobs: number
  activeJobs: number
  completedJobs: number
  totalEarnings: number
  rating: number
  totalReviews: number
}

export interface AdminStats {
  users: {
    total: number
    clients: number
    freelancers: number
    active: number
  }
  jobs: {
    total: number
    open: number
    inProgress: number
    completed: number
  }
  payments: {
    total: number
    pending: number
    successful: number
    revenue: number
  }
}

// Form data interfaces
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: 'client' | 'freelancer'
}

export interface JobFormData {
  title: string
  description: string
  category: string
  budget: {
    min: number
    max: number
    type: 'fixed' | 'hourly'
  }
  deadline: string
  skills: string[]
  location: string
}

export interface BidFormData {
  jobId: string
  amount: number
  message: string
  deliveryTime: number
}

export interface PaymentFormData {
  jobId: string
  amount: number
  utrNumber?: string
}

export interface ReviewFormData {
  jobId: string
  rating: number
  feedback: string
  categories: {
    communication: number
    quality: number
    timeliness: number
    professionalism: number
  }
}

// Filter interfaces
export interface JobFilters {
  search: string
  category: string
  minBudget: string
  maxBudget: string
  location: string
  status: string
}

export interface UserFilters {
  search: string
  skill: string
  minRating: string
  role: string
}

// Socket event interfaces
export interface SocketEvents {
  join_room: (roomId: string) => void
  leave_room: (roomId: string) => void
  send_message: (data: {
    roomId: string
    content: string
    senderId: string
    files?: File[]
  }) => void
  new_message: (message: Message) => void
  error: (error: { message: string }) => void
}
