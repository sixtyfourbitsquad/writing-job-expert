'use client'

import { useState } from 'react'
import axios from 'axios'

export default function TestApiPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testRegister = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        role: 'client'
      })
      setResult(`Success: ${JSON.stringify(response.data, null, 2)}`)
    } catch (error: any) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      })
      setResult(`Success: ${JSON.stringify(response.data, null, 2)}`)
    } catch (error: any) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testRegister}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Register API'}
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login API'}
          </button>
        </div>

        <div className="bg-white p-4 rounded border">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="whitespace-pre-wrap text-sm">{result || 'Click a button to test the API'}</pre>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Environment Info:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL}</p>
            <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
