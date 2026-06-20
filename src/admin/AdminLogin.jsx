import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const redirectPath = location.state?.from?.pathname || '/admin/dashboard'

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true })
    }
  }, [user, navigate, redirectPath])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
      navigate(redirectPath, { replace: true })
    } catch (err) {
      console.error('Login submission failed:', err)
      setError(err.message || 'Invalid email or password. Access denied.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | AP Events Secure Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-luxury-bg flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-15" />

        <div className="w-full max-w-md relative z-10">
          <div className="glass-card p-10 rounded-sm border border-gold/25 shadow-gold-glow-lg text-center">
            
            {/* Shield Logo Header */}
            <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-gold mx-auto mb-6 bg-luxury-black shadow-gold-glow">
              <Shield size={28} />
            </div>

            <h1 className="font-playfair text-2xl font-bold uppercase tracking-widest text-white mb-2">
              AP Events Admin
            </h1>
            <p className="text-luxury-muted text-xs uppercase tracking-wider mb-8 font-poppins font-medium">
              Secure Operations Access
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {error && (
                <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 p-4 rounded-sm text-red-400 text-xs">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-2 font-poppins">Admin Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gold/60 pointer-events-none">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@apevents.com"
                    className="w-full bg-luxury-black/60 border border-gold/20 rounded-sm pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all duration-300 font-poppins"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-2 font-poppins">Secret Passcode</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gold/60 pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-luxury-black/60 border border-gold/20 rounded-sm pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all duration-300 font-poppins"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold-gradient text-luxury-black font-semibold py-4 uppercase tracking-widest text-xs rounded-sm hover:shadow-gold-glow active:scale-95 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border border-luxury-black/20 border-t-luxury-black rounded-full animate-spin" />
                ) : (
                  'Authorize Entry'
                )}
              </button>
            </form>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/" className="text-xs text-luxury-muted hover:text-gold transition-colors font-poppins uppercase tracking-widest">
              ← Return To Main Website
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
