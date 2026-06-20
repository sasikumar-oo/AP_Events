import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center">
        {/* Luxury Gold Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-gold/25" />
          <div className="absolute inset-0 rounded-full border-t-2 border-gold animate-spin" />
        </div>
        <span className="mt-6 font-playfair tracking-widest text-gold text-sm uppercase animate-pulse">
          AP Events Secure Portal
        </span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}
