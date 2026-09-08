import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoImg from '../videos/logo.ap.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'py-3 px-4 md:px-8' : 'py-6 px-4 md:px-8'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-8 flex justify-between items-center transition-all duration-500 rounded-full ${
          isScrolled
            ? 'py-3 bg-luxury-black/75 backdrop-blur-xl border border-gold/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.6),0_0_20px_rgba(212,175,55,0.15)]'
            : 'py-3 bg-transparent border border-transparent shadow-none'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src={logoImg}
            alt="AP Events Logo"
            className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
              isScrolled ? 'h-12 md:h-16 lg:h-18' : 'h-16 md:h-20 lg:h-24'
            }`}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-poppins text-sm tracking-wider uppercase transition-all duration-300 relative py-1 ${
                isActive(link.path)
                  ? 'text-gold'
                  : 'text-white/80 hover:text-gold'
              }`}
            >
              {link.name}
              {/* Animated Underline */}
              <span
                className={`absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 transition-transform duration-300 origin-left ${
                  isActive(link.path) ? 'scale-x-100' : 'hover:scale-x-100'
                }`}
              />
            </Link>
          ))}

          {/* Admin Dashboard shortcut if logged in */}
          {user && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 border border-gold/50 text-gold px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider hover:bg-gold hover:text-luxury-black transition-all duration-300 font-semibold"
            >
              <ShieldAlert size={14} />
              Admin Portal
            </Link>
          )}

          <Link
            to="/contact"
            className="btn-gold-outline px-6 py-2 text-xs uppercase tracking-widest font-semibold rounded-full"
          >
            Inquire Now
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white hover:text-gold transition-colors duration-300 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 top-[73px] md:top-[85px] w-full bg-luxury-black/95 backdrop-blur-lg border-t border-gold/15 lg:hidden transition-all duration-500 transform ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-8 py-16 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-playfair text-xl tracking-widest uppercase transition-colors duration-300 ${
                isActive(link.path) ? 'text-gold font-semibold' : 'text-white hover:text-gold'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 text-gold text-lg tracking-wider hover:underline"
            >
              <ShieldAlert size={18} />
              Admin Dashboard
            </Link>
          )}

          <Link
            to="/contact"
            className="btn-gold-outline w-full max-w-xs text-center py-3 text-sm uppercase tracking-widest font-semibold rounded-sm mt-4"
          >
            Book An Consultation
          </Link>
        </div>
      </div>
    </nav>
  )
}
