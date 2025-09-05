'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  sendMessage: (message: MessageData) => void
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
}

interface MessageData {
  roomId: string
  content: string
  files?: File[]
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  useEffect(() => {
    if (user) {
      const newSocket = io(API_URL, {
        auth: {
          token: document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1]
        }
      })

      newSocket.on('connect', () => {
        setIsConnected(true)
        console.log('Connected to server')
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
        console.log('Disconnected from server')
      })

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [user, API_URL])

  const sendMessage = (messageData: MessageData) => {
    if (socket && isConnected) {
      socket.emit('send_message', messageData)
    }
  }

  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('join_room', roomId)
    }
  }

  const leaveRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_room', roomId)
    }
  }

  const value = {
    socket,
    isConnected,
    sendMessage,
    joinRoom,
    leaveRoom
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
