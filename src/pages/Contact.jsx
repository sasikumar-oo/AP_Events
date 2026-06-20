import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const [contact, setContact] = useState({
    phone: '+91 98765 43210',
    email: 'info@apevents.com',
    address: 'AP Luxury Towers, MG Road, Kochi, Kerala - 682016',
    google_map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.800057038965!2d76.27961237583647!3d9.950616176662483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d38ff3a9fd5%3A0xc3cf9c98bc02140a!2sMG%20Road%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
  })

  // Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [eventType, setEventType] = useState('Weddings')
  const [eventDate, setEventDate] = useState('')
  const [message, setMessage] = useState('')

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Pre-fill fields from query params if available
  useEffect(() => {
    const svcParam = searchParams.get('service')
    if (svcParam) {
      setEventType(svcParam)
    }

    const fetchContactDetails = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'contact_info')
          .single()
        if (data && data.value) {
          setContact(data.value)
        }
      } catch (err) {
        console.error('Failed to load contact page values:', err)
      }
    }
    fetchContactDetails()
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!name.trim()) return setError('Please specify your name.')
    if (!phone.trim()) return setError('Please specify your contact phone number.')
    
    setSubmitting(true)

    try {
      const { error: dbErr } = await supabase
        .from('enquiries')
        .insert([
          {
            name: name.trim(),
            phone: phone.trim(),
            event_type: eventType,
            event_date: eventDate || null,
            message: message.trim() || null
          }
        ])

      if (dbErr) throw dbErr

      setSuccess(true)
      setName('')
      setPhone('')
      setEventDate('')
      setMessage('')
    } catch (err) {
      console.error('Enquiry insertion error:', err)
      setError('An error occurred during submission. Please try again or contact us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClasses = "w-full bg-luxury-black/60 border border-gold/25 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all duration-300 font-poppins placeholder:text-luxury-muted/70"

  return (
    <>
      <Helmet>
        <title>Contact & Inquiries | AP Events Luxury Planner</title>
        <meta name="description" content="Get in touch with our elite events consultation desk. Fill out our booking enquiry form to receive a custom luxury project proposal." />
      </Helmet>

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 bg-luxury-black border-b border-gold/15">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">The Connection</span>
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-white uppercase mt-2">
            Inquire & Connect
          </h1>
          <div className="h-[1px] w-24 bg-gold mx-auto mt-4" />
        </div>
      </section>

      {/* Main Grid: Form and Coordinates */}
      <section className="py-24 bg-luxury-bg relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* 1. Contact Form (Left) */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-12 rounded-sm border border-gold/15">
            <h2 className="text-2xl font-playfair text-gold uppercase tracking-widest mb-2 font-bold">
              Project Consultation Form
            </h2>
            <p className="text-luxury-muted text-xs mb-8 font-poppins">
              Please fill in your design objectives, and our senior event architect will schedule a briefing session.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error and Success Banners */}
              {error && (
                <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 p-4 rounded-sm text-red-400 text-xs">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 border border-gold/30 bg-gold/10 p-4 rounded-sm text-gold text-xs">
                  <CheckCircle2 size={16} />
                  <span>Your luxury enquiry has been logged successfully! Our team will contact you shortly.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-2 font-poppins">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aravind Nair"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-2 font-poppins">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-2 font-poppins">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-luxury-black/60 border border-gold/25 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all duration-300 font-poppins appearance-none cursor-pointer"
                  >
                    {[
                      'Weddings', 'Corporate Events', 'College Functions', 'Birthday Parties', 
                      'Temple Events', 'Chenda Melam', 'DJ Music', 'Photography', 
                      'Balloon Decoration', 'Event Decoration', 'Welcome Hostesses', 
                      'Bridal Makeup', 'Security Services', 'Dhol & Band Players'
                    ].map(type => (
                      <option key={type} value={type} className="bg-luxury-black text-white">{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-2 font-poppins">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-2 font-poppins">Design Message / Custom Requirements</label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline the theme, estimated guests, venue, or custom requirements..."
                  className={inputClasses}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold-gradient text-luxury-black font-semibold py-4 uppercase tracking-widest text-xs rounded-sm hover:shadow-gold-glow-lg active:scale-95 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border border-luxury-black/20 border-t-luxury-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={14} /> Submit Query
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 2. Coordinates Details (Right) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-2xl font-playfair text-white uppercase tracking-wider font-bold">
                The Headquarters
              </h2>
              <p className="text-luxury-muted text-xs leading-relaxed font-light">
                Our main studio is located on MG Road. We welcome appointments for design consultations, cake tastings, and decor model reviews.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin size={20} className="text-gold mr-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-1">Corporate Office</span>
                    <p className="text-white/80 text-xs leading-relaxed">{contact.address}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone size={18} className="text-gold mr-4 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-0.5">Telephone Call</span>
                    <a href={`tel:${contact.phone}`} className="text-white/80 text-xs hover:text-gold transition-colors">{contact.phone}</a>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail size={18} className="text-gold mr-4 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-0.5">Electronic Mail</span>
                    <a href={`mailto:${contact.email}`} className="text-white/80 text-xs hover:text-gold transition-colors">{contact.email}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="w-full aspect-video lg:aspect-auto lg:h-[220px] rounded-sm border border-gold/15 overflow-hidden">
              <iframe
                title="AP Events HQ Location Map"
                src={contact.google_map_url}
                className="w-full h-full border-0 grayscale invert opacity-75 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
