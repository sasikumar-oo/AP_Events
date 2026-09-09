import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, Calendar, Phone, Mail, User,
  HelpCircle, Sparkles, ShieldCheck, Award, MessageSquare, ExternalLink
} from 'lucide-react'
import { getServiceBySlug, servicesData } from '../data/servicesData'
import { supabase } from '../supabaseClient'
import { notifyAdminOnInquiry } from '../services/notificationService'
import { parseImageUrl } from '../services/instagramService'

export default function ServiceDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(() => getServiceBySlug(slug))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCustomService = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('value').eq('key', 'custom_services').maybeSingle()
        if (data && data.value && Array.isArray(data.value)) {
          const found = data.value.find(s => (s.slug && s.slug.toLowerCase() === slug.toLowerCase()) || (s.id && s.id.toString().toLowerCase() === slug.toLowerCase()))
          if (found) {
            setService({
              title: found.title,
              category: found.category || 'Signature Events',
              shortDesc: found.shortDesc || found.fullDesc || '',
              fullDesc: found.fullDesc || found.shortDesc || '',
              heroImage: parseImageUrl(found.heroImage || found.img),
              gallery: (found.gallery && found.gallery.length > 0 ? found.gallery : [found.heroImage || found.img]).map(g => parseImageUrl(g)),
              features: found.features || ['Luxury Event Architecture', 'VIP Hospitality'],
              process: found.process || [
                { step: '01', title: 'Consultation & Concept', desc: 'Mapping client requirements and budget.' },
                { step: '02', title: 'Flawless Execution', desc: 'Professional on-site coordination and VIP service.' }
              ],
              faqs: found.faqs || [
                { q: 'How early should we book this service package?', a: 'We recommend booking 2 to 6 months in advance for peak wedding and festival seasons.' }
              ]
            })
          }
        }
      } catch (err) {
        console.log('Using default static service data.')
      }
    }
    fetchCustomService()
  }, [slug])

  // Quick inquiry state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedWaUrl, setSubmittedWaUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (!service) {
    return (
      <div className="min-h-screen bg-luxury-bg flex flex-col items-center justify-center px-6 py-32 text-center">
        <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-gold mb-4 uppercase tracking-wider">
          Service Not Found
        </h1>
        <p className="text-luxury-muted text-sm md:text-base max-w-md mb-8">
          The luxury service package you are looking for may have been updated or moved.
        </p>
        <Link
          to="/services"
          className="btn-gold px-8 py-3 rounded-sm text-xs uppercase font-bold tracking-widest flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Explore All Services
        </Link>
      </div>
    )
  }

  // Handle quick inquiry form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        event_type: service.title,
        event_date: formData.eventDate || null,
        message: formData.message || `Inquiry for ${service.title} service.`,
        created_at: new Date().toISOString()
      }

      const { error } = await supabase.from('enquiries').insert([payload])
      if (error) throw error

      // Automatically dispatch Email & WhatsApp notifications to Admin
      const { waUrl } = await notifyAdminOnInquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        eventType: service.title,
        eventDate: formData.eventDate,
        message: formData.message,
        autoOpenWhatsApp: true
      })
      setSubmittedWaUrl(waUrl)

      setSubmitted(true)
      setFormData({ name: '', phone: '', email: '', eventDate: '', message: '' })
    } catch (err) {
      console.error('Failed to submit enquiry:', err)
      setErrorMsg('Failed to send inquiry. Please try again or contact us directly via WhatsApp/Phone.')
    } finally {
      setSubmitting(false)
    }
  }

  // Related services (excluding current)
  const relatedServices = servicesData
    .filter(s => s.slug !== service.slug)
    .slice(0, 3)

  // Motion variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  // Dynamic Schema.org JSON-LD
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "provider": {
      "@type": "Organization",
      "name": "AP Events",
      "url": "https://apevents.com"
    },
    "description": service.shortDesc,
    "areaServed": "Kerala, India",
    "serviceType": service.category
  }

  return (
    <>
      <Helmet>
        <title>{service.seoTitle || `${service.title} | AP Events`}</title>
        <meta name="description" content={service.seoDesc || service.shortDesc} />
        <meta property="og:title" content={`${service.title} | AP Events Luxury Services`} />
        <meta property="og:description" content={service.shortDesc} />
        <meta property="og:image" content={service.heroImage} />
        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
      </Helmet>

      {/* 1. HERO HEADER */}
      <section className="relative pt-32 pb-20 bg-luxury-black border-b border-gold/15 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Breadcrumb Back Link */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold/80 hover:text-gold mb-6 transition-colors font-poppins"
          >
            <ArrowLeft size={14} /> Back To All Services
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block bg-gold/10 border border-gold/30 text-gold px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest font-semibold mb-3">
                {service.category}
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-playfair font-bold text-white uppercase leading-tight">
                {service.title}
              </h1>
            </div>

            <Link
              to={`/contact?service=${encodeURIComponent(service.title)}`}
              className="btn-gold px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest shrink-0 text-center shadow-gold-glow"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MAIN OVERVIEW & HERO IMAGE */}
      <section className="py-20 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Main Visual & Content (8 cols) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative h-[380px] sm:h-[480px] rounded-sm overflow-hidden border border-gold/20 group"
            >
              <img
                src={parseImageUrl(service.heroImage)}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-4 glass-card rounded-sm border border-gold/20">
                <span className="text-gold font-poppins text-xs font-semibold uppercase tracking-wider block mb-1">
                  AP Events Guarantee
                </span>
                <p className="text-white text-xs leading-relaxed">
                  Bespoke art direction, zero operational delays, and dedicated 24/7 concierge management.
                </p>
              </div>
            </motion.div>

            {/* In-Depth Description */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="glass-card p-8 sm:p-10 rounded-sm border border-gold/15 space-y-6"
            >
              <h2 className="text-2xl font-playfair font-bold text-white uppercase tracking-wider flex items-center gap-3">
                <Sparkles className="text-gold" size={24} /> Service Philosophy & Standards
              </h2>
              <p className="text-luxury-muted text-sm md:text-base leading-relaxed font-light">
                {service.fullDesc}
              </p>
            </motion.div>

            {/* Key Capabilities & Deliverables Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-6"
            >
              <h3 className="text-xl font-playfair font-bold text-white uppercase tracking-wider">
                Included Features & Deliverables
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="glass-card p-4 rounded-sm border border-gold/10 flex items-start gap-3 hover:border-gold/30 transition-colors"
                  >
                    <CheckCircle2 className="text-gold shrink-0 mt-0.5" size={18} />
                    <span className="text-xs sm:text-sm text-white/90 font-poppins leading-normal">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Execution Process Steps */}
            {service.process && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="space-y-6 pt-4"
              >
                <h3 className="text-xl font-playfair font-bold text-white uppercase tracking-wider">
                  Our Execution Pipeline
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.process.map((p, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-sm border border-gold/15 relative overflow-hidden">
                      <span className="text-3xl font-playfair font-bold text-gold/25 absolute top-3 right-4">
                        {p.step}
                      </span>
                      <h4 className="text-sm font-playfair font-bold text-gold uppercase tracking-wider mb-2">
                        {p.title}
                      </h4>
                      <p className="text-luxury-muted text-xs leading-relaxed font-light">
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FAQs Accordion / List */}
            {service.faqs && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="space-y-6 pt-4"
              >
                <h3 className="text-xl font-playfair font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="text-gold" size={20} /> Frequently Asked Questions
                </h3>

                <div className="space-y-4">
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-sm border border-gold/10 space-y-2">
                      <h4 className="text-sm font-semibold text-white font-poppins">
                        {faq.q}
                      </h4>
                      <p className="text-luxury-muted text-xs leading-relaxed font-light">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

          {/* Sidebar Inquiry Widget (4 cols) */}
          <div className="lg:col-span-4 sticky top-28 space-y-8">

            {/* Quick Inquiry Card */}
            <div className="glass-card p-6 sm:p-8 rounded-sm border border-gold/30 shadow-gold-glow">
              <h3 className="text-lg font-playfair font-bold text-gold uppercase tracking-wider mb-2">
                Inquire For {service.title}
              </h3>
              <p className="text-luxury-muted text-xs mb-6 font-light">
                Fill out the quick form below for availability, customized packages, and pricing details.
              </p>

              {submitted ? (
                <div className="bg-gold/15 border border-gold p-6 rounded-sm text-center space-y-3">
                  <CheckCircle2 className="text-gold mx-auto" size={32} />
                  <h4 className="text-white text-sm font-bold font-playfair uppercase">Inquiry Logged</h4>
                  <p className="text-luxury-muted text-xs">
                    Thank you! Our senior event planner will reach out to you within 2 hours. Email notification has been dispatched to our team.
                  </p>
                  {submittedWaUrl && (
                    <a
                      href={submittedWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs px-4 py-2 rounded-sm shadow-md uppercase tracking-wider transition-all mt-2"
                    >
                      <MessageSquare size={14} /> Send Copy on WhatsApp <ExternalLink size={12} />
                    </a>
                  )}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[10px] text-gold uppercase tracking-widest underline font-semibold pt-2 block mx-auto"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <p className="text-red-400 text-xs bg-red-950/50 p-2.5 rounded border border-red-800">
                      {errorMsg}
                    </p>
                  )}

                  <div>
                    <label className="block text-[10px] text-luxury-muted uppercase tracking-widest mb-1 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-luxury-black/60 border border-gold/20 focus:border-gold px-3.5 py-2.5 rounded-sm text-xs text-white placeholder-luxury-muted/40 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-luxury-muted uppercase tracking-widest mb-1 font-semibold">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-luxury-black/60 border border-gold/20 focus:border-gold px-3.5 py-2.5 rounded-sm text-xs text-white placeholder-luxury-muted/40 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-luxury-muted uppercase tracking-widest mb-1 font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-luxury-black/60 border border-gold/20 focus:border-gold px-3.5 py-2.5 rounded-sm text-xs text-white placeholder-luxury-muted/40 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-luxury-muted uppercase tracking-widest mb-1 font-semibold">
                      Expected Event Date
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full bg-luxury-black/60 border border-gold/20 focus:border-gold px-3.5 py-2.5 rounded-sm text-xs text-white outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-luxury-muted uppercase tracking-widest mb-1 font-semibold">
                      Event Notes / Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share estimated guest count, venue preferences, or specific ideas..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-luxury-black/60 border border-gold/20 focus:border-gold px-3.5 py-2.5 rounded-sm text-xs text-white placeholder-luxury-muted/40 outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-gold py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
                  >
                    {submitting ? 'Sending Request...' : 'Request Quotation'}
                  </button>
                </form>
              )}
            </div>

            {/* Direct Contact Card */}
            <div className="glass-card p-6 rounded-sm border border-gold/15 space-y-4">
              <h4 className="text-xs uppercase font-semibold text-gold tracking-widest font-poppins">
                Direct Hotline Concierge
              </h4>
              <p className="text-luxury-muted text-xs font-light">
                Prefer immediate assistance? Speak directly with our lead planner.
              </p>
              <div className="space-y-2 pt-1 text-xs text-white">
                <a href="tel:+919150226356" className="flex items-center gap-3 hover:text-gold transition-colors">
                  <Phone size={14} className="text-gold" /> +91 91502 26356 / 90807 17153
                </a>
                <a href="mailto:info@apevents.com" className="flex items-center gap-3 hover:text-gold transition-colors">
                  <Mail size={14} className="text-gold" /> info@apevents.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. RELATED SERVICES CAROUSEL / GRID */}
      <section className="py-20 bg-luxury-black border-t border-gold/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">Explore More</span>
              <h2 className="text-2xl sm:text-4xl font-playfair font-bold text-white uppercase mt-1">
                Other Signature Services
              </h2>
            </div>
            <Link
              to="/services"
              className="text-xs text-gold hover:underline uppercase tracking-widest font-semibold hidden sm:block"
            >
              View All 14 Services &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedServices.map((relSvc) => (
              <div key={relSvc.slug} className="glass-card rounded-sm overflow-hidden border border-gold/15 flex flex-col group">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={relSvc.heroImage}
                    alt={relSvc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 right-3 bg-luxury-black/90 border border-gold/30 px-2.5 py-1 rounded-sm text-[9px] uppercase tracking-widest text-gold">
                    {relSvc.category}
                  </span>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-playfair font-bold text-white uppercase">
                      {relSvc.title}
                    </h3>
                    <p className="text-luxury-muted text-xs leading-relaxed font-light line-clamp-2 mt-2">
                      {relSvc.shortDesc}
                    </p>
                  </div>
                  <Link
                    to={`/services/${relSvc.slug}`}
                    className="text-xs text-gold font-semibold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View Service Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
