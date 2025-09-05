'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
  role: 'client' | 'freelancer' | 'admin'
  profile?: {
    bio?: string
    skills?: string[]
    portfolio?: string[]
    profilePicture?: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
  updateProfile: (profileData: Partial<User['profile']>) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: 'client' | 'freelancer'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = Cookies.get('token')
      const response = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data.user)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      Cookies.remove('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      })
      
      const { token, user: userData } = response.data
      Cookies.set('token', token, { expires: 7 })
      setUser(userData)
      router.push('/dashboard')
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData)
      
      const { token, user: newUser } = response.data
      Cookies.set('token', token, { expires: 7 })
      setUser(newUser)
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Registration error:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Registration failed'
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    router.push('/')
  }

  const updateProfile = async (profileData: Partial<User['profile']>) => {
    try {
      const token = Cookies.get('token')
      const response = await axios.put(
        `${API_URL}/api/auth/profile`,
        { profile: profileData },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(response.data.user)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed')
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
