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
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-2.5 px-4 md:px-8' : 'py-4 px-4 md:px-8'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo on Left */}
        <Link to="/" className="flex items-center space-x-2 group shrink-0">
          <img
            src={logoImg}
            alt="AP Events Logo"
            className={`w-auto object-contain transition-all duration-300 ${
              isScrolled ? 'h-8 sm:h-9 md:h-10' : 'h-9 sm:h-10 md:h-11'
            }`}
          />
        </Link>

        {/* Desktop Glassmorphism Floating Tab (Only for Home, Services, Gallery, Events, Contact, Inquiry) */}
        <div
          className={`hidden lg:flex items-center space-x-6 xl:space-x-8 px-6 py-2.5 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'bg-luxury-black/90 backdrop-blur-xl border border-gold/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.7),0_0_20px_rgba(212,175,55,0.2)]'
              : 'bg-luxury-black/80 backdrop-blur-md border border-gold/25 shadow-[0_4px_20px_0_rgba(0,0,0,0.5),0_0_12px_rgba(212,175,55,0.1)]'
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-poppins text-[11px] xl:text-xs tracking-widest uppercase transition-all duration-300 relative py-1 ${
                isActive(link.path)
                  ? 'text-gold font-semibold'
                  : 'text-white/85 hover:text-gold'
              }`}
            >
              {link.name}
              {/* Animated Underline */}
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-gold scale-x-0 transition-transform duration-300 origin-left ${
                  isActive(link.path) ? 'scale-x-100' : 'hover:scale-x-100'
                }`}
              />
            </Link>
          ))}

          {/* Admin Portal Shortcut if Logged In */}
          {user && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 border border-gold/50 text-gold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider hover:bg-gold hover:text-luxury-black transition-all duration-300 font-semibold"
            >
              <ShieldAlert size={12} />
              Admin Portal
            </Link>
          )}

          {/* Inquiry CTA */}
          <Link
            to="/contact"
            className="bg-gold-gradient text-luxury-black px-5 py-1.5 text-[10.5px] xl:text-[11px] uppercase tracking-widest font-bold rounded-full shadow-gold-glow hover:scale-105 transition-all"
          >
            Inquiry
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white hover:text-gold transition-colors duration-300 focus:outline-none p-2 bg-luxury-black/80 border border-gold/30 rounded-full backdrop-blur-md shadow-md"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 top-[64px] sm:top-[70px] w-full bg-luxury-black/95 backdrop-blur-xl border-t border-gold/15 lg:hidden transition-all duration-500 transform ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-6 py-12 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-playfair text-lg tracking-widest uppercase transition-colors duration-300 ${
                isActive(link.path) ? 'text-gold font-semibold' : 'text-white hover:text-gold'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 text-gold text-sm tracking-wider hover:underline"
            >
              <ShieldAlert size={16} />
              Admin Dashboard
            </Link>
          )}

          <Link
            to="/contact"
            className="bg-gold-gradient text-luxury-black w-full max-w-xs text-center py-2.5 text-xs uppercase tracking-widest font-bold rounded-full mt-2 shadow-gold-glow"
          >
            Inquiry
          </Link>
        </div>
      </div>
    </nav>
  )
}
