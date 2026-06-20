import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Facebook, ArrowRight } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function Footer() {
  const [contact, setContact] = useState({
    phone: '+91 98765 43210',
    email: 'info@apevents.com',
    address: 'AP Luxury Towers, MG Road, Kochi, Kerala - 682016',
    instagram: '@ap_events_luxury',
    facebook: 'ap.events.luxury'
  })

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'contact_info')
          .single()
        
        if (data && data.value) {
          setContact(data.value)
        }
      } catch (err) {
        console.error('Failed to load footer contact info:', err)
      }
    }
    fetchContactInfo()
  }, [])

  return (
    <footer className="bg-luxury-black border-t border-gold/15 pt-16 pb-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
        {/* Brand Information */}
        <div>
          <span className="font-playfair text-2xl font-bold tracking-widest text-gold block mb-6">
            AP EVENTS
          </span>
          <p className="text-luxury-muted text-sm leading-relaxed mb-6 font-poppins">
            Designing and executing high-end events across the country. From regal weddings to high-impact corporate summits, we make every moment golden.
          </p>
          <div className="flex space-x-4">
            <a
              href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-luxury-muted hover:text-gold hover:border-gold hover:shadow-gold-glow transition-all duration-300"
            >
              <Instagram size={18} />
            </a>
            <a
              href={`https://facebook.com/${contact.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-luxury-muted hover:text-gold hover:border-gold hover:shadow-gold-glow transition-all duration-300"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Quick Directory */}
        <div>
          <h4 className="text-white uppercase text-sm tracking-wider font-semibold mb-6 border-b border-gold/10 pb-2">
            Navigation
          </h4>
          <ul className="space-y-3 text-sm">
            {['Home', 'About', 'Services', 'Events', 'Gallery', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-luxury-muted hover:text-gold transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 mr-2 text-gold" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Services Links */}
        <div>
          <h4 className="text-white uppercase text-sm tracking-wider font-semibold mb-6 border-b border-gold/10 pb-2">
            Signature Services
          </h4>
          <ul className="space-y-3 text-sm text-luxury-muted">
            {['Luxury Weddings', 'Corporate Conclaves', 'Chenda Melam Beats', 'Premium Photography', 'Exclusive DJ & Band'].map((svc) => (
              <li key={svc} className="hover:text-gold transition-colors duration-300 cursor-pointer">
                <Link to="/services">{svc}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white uppercase text-sm tracking-wider font-semibold mb-6 border-b border-gold/10 pb-2">
            The Mansion
          </h4>
          <ul className="space-y-4 text-sm text-luxury-muted">
            <li className="flex items-start">
              <MapPin size={18} className="text-gold mr-3 shrink-0 mt-0.5" />
              <span>{contact.address}</span>
            </li>
            <li className="flex items-center">
              <Phone size={16} className="text-gold mr-3 shrink-0" />
              <a href={`tel:${contact.phone}`} className="hover:text-gold transition-colors">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center">
              <Mail size={16} className="text-gold mr-3 shrink-0" />
              <a href={`mailto:${contact.email}`} className="hover:text-gold transition-colors">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-gold/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-luxury-muted">
        <p className="mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} AP Events. All Rights Reserved. Crafted with pure luxury.
        </p>
        <div className="space-x-6">
          <Link to="/admin/login" className="hover:text-gold transition-colors">
            Secure Admin Portal
          </Link>
          <a href="#" className="hover:text-gold transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}
