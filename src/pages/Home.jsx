import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Calendar, MapPin, ArrowRight, Star, Sparkles, PhoneCall, Gift, Shield } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function Home() {
  const [hero, setHero] = useState({
    title: 'Crafting Extraordinary Luxury Experiences',
    subtitle: 'AP Events is the premier event planner specializing in royal weddings, grand corporate events, traditional temple festivals, and elite private gatherings.',
    bg_image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1920',
    cta_text: 'Plan Your Event'
  })
  const [events, setEvents] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // 1. Fetch site settings for hero
        const { data: heroData } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_banner')
          .single()
        if (heroData && heroData.value) {
          setHero(heroData.value)
        }

        // 2. Fetch recent events (limit 3, published)
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false })
          .limit(3)
        if (eventsData) setEvents(eventsData)

        // 3. Fetch testimonials (limit 3)
        const { data: testimonialsData } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)
        if (testimonialsData) setTestimonials(testimonialsData)

      } catch (err) {
        console.error('Error fetching home page data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHomeData()
  }, [])

  // Framer Motion presets
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>AP Events | Premium Luxury Event Management & Production</title>
        <meta name="description" content="Welcome to AP Events. We plan premium royal weddings, corporate summits, traditional temple festivals, and elite parties. Discover our golden standards of production." />
        <meta property="og:title" content="AP Events | Premium Luxury Event Management" />
        <meta property="og:description" content="Welcome to AP Events. We plan premium royal weddings, corporate summits, traditional temple festivals, and elite parties." />
        <meta property="og:image" content={hero.bg_image} />
      </Helmet>

      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(11, 11, 11, 0.4) 0%, rgba(11, 11, 11, 0.9) 100%), url(${hero.bg_image})` 
          }}
        />

        {/* Overlay grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-20" />

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-4 inline-flex items-center space-x-2 border border-gold/45 bg-luxury-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-gold animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-gold font-semibold font-poppins">AP Events Exclusive</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl sm:text-6xl md:text-8xl font-playfair font-bold text-white mb-6 uppercase tracking-wider leading-none"
          >
            {hero.title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 1 ? 'text-gold-gradient block sm:inline' : 'block sm:inline mr-4'}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-luxury-muted font-poppins text-base md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-light"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Link
              to="/contact"
              className="bg-gold-gradient text-luxury-black font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded-sm shadow-gold-glow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto text-center"
            >
              {hero.cta_text}
            </Link>
            <Link
              to="/services"
              className="btn-gold-outline px-8 py-4 text-sm font-semibold uppercase tracking-widest rounded-sm w-full sm:w-auto text-center"
            >
              Explore Services
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-gold/60 mb-2 font-poppins">Scroll Down</span>
          <div className="w-[1.5px] h-12 bg-gradient-to-b from-gold to-transparent animate-bounce" />
        </div>
      </section>

      {/* 2. COMPANY INTRODUCTION */}
      <section className="py-24 bg-luxury-black relative overflow-hidden border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold block">About The Dynasty</span>
            <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-white uppercase leading-tight">
              Bridging Heritage & High-End Artistry
            </h2>
            <p className="text-luxury-muted text-sm md:text-base leading-relaxed font-light">
              Founded on the pillars of precision, creativity, and magnificence, AP Events orchestrates events that defy the ordinary. From grand palaces to tech arenas, we design settings that tell a unique, luxury story.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-poppins font-medium tracking-wider uppercase text-white/90">
              <div className="flex items-center gap-3"><Sparkles size={16} className="text-gold" /> Custom Curated Decor</div>
              <div className="flex items-center gap-3"><Shield size={16} className="text-gold" /> VIP Security Services</div>
              <div className="flex items-center gap-3"><Gift size={16} className="text-gold" /> Full Service Execution</div>
              <div className="flex items-center gap-3"><PhoneCall size={16} className="text-gold" /> 24/7 Concierge Planning</div>
            </div>
            <div className="pt-6">
              <Link
                to="/about"
                className="inline-flex items-center text-gold uppercase tracking-widest text-xs font-bold gap-2 group hover:text-gold-light transition-colors"
              >
                Learn More About Us <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 border border-gold/25 translate-x-4 translate-y-4 rounded-sm" />
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
              alt="About AP Events Luxury Planning"
              className="relative z-10 w-full h-[450px] object-cover rounded-sm border border-gold/15"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES */}
      <section className="py-24 bg-luxury-bg relative border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">Our Portfolio</span>
            <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-white uppercase mt-2">
              Signature Event Formats
            </h2>
            <div className="h-[1px] w-24 bg-gold mx-auto mt-4" />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Royal Weddings',
                desc: 'Opulent configurations, customized stage designs, elite guest management, and traditional grandeur.',
                img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=500'
              },
              {
                title: 'Corporate Galas',
                desc: 'State-of-the-art production, audio-visual layouts, professional hostesses, and media integrations.',
                img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=500'
              },
              {
                title: 'Chenda Melam & Festivals',
                desc: 'Majestic beats, premium artists, customized temple stage settings, and loud high-energy traditional events.',
                img: 'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=500'
              }
            ].map((svc, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="glass-card glass-card-hover group overflow-hidden rounded-sm border border-gold/15"
              >
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={svc.img}
                    alt={svc.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-playfair font-bold text-gold uppercase tracking-wider mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-luxury-muted text-xs leading-relaxed mb-4">
                    {svc.desc}
                  </p>
                  <Link
                    to="/services"
                    className="text-white hover:text-gold uppercase tracking-widest text-[10px] font-semibold flex items-center gap-1 transition-colors duration-300"
                  >
                    View Packages <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="btn-gold-outline px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm inline-block"
            >
              See All 14 Luxury Services
            </Link>
          </div>
        </div>
      </section>

      {/* 4. RECENT EVENTS */}
      <section className="py-24 bg-luxury-black relative border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16">
            <div>
              <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">Live Snapshots</span>
              <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-white uppercase mt-2">
                Recent Excursions
              </h2>
            </div>
            <Link
              to="/events"
              className="text-gold hover:text-gold-light uppercase tracking-widest text-xs font-bold flex items-center gap-2 mt-4 md:mt-0 transition-colors"
            >
              Browse Event Logs <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-gold/25" />
                <div className="absolute inset-0 rounded-full border-t-2 border-gold animate-spin" />
              </div>
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-luxury-muted">No recent events logged. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((evt) => (
                <motion.article
                  key={evt.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="glass-card glass-card-hover group rounded-sm overflow-hidden"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={evt.image_url || 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600'}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-luxury-black/80 border border-gold/30 px-3 py-1 rounded-sm text-[10px] text-gold font-poppins uppercase tracking-widest">
                      {evt.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-[10px] text-luxury-muted mb-3 font-poppins uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar size={12} className="text-gold" /> {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-gold" /> {evt.location}</span>
                    </div>
                    <h3 className="text-lg font-playfair font-bold text-white uppercase tracking-wider mb-3 leading-tight group-hover:text-gold transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-luxury-muted text-xs leading-relaxed line-clamp-2 mb-4">
                      {evt.description}
                    </p>
                    <Link
                      to={`/events/${evt.slug}`}
                      className="text-gold hover:text-white uppercase tracking-widest text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      Read Full Article <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-luxury-bg relative overflow-hidden border-b border-gold/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">Accolades</span>
          <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-white uppercase mt-2 mb-16">
            Elite Commendations
          </h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full border border-gold/25 border-t-gold animate-spin" />
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-luxury-muted">Client reviews are currently being compiled.</p>
          ) : (
            <div className="space-y-8">
              {testimonials.map((testi, idx) => (
                <div key={testi.id} className="glass-card p-8 md:p-12 rounded-sm border border-gold/10 relative">
                  <span className="text-5xl md:text-7xl font-playfair text-gold/10 absolute top-4 left-6 select-none">“</span>
                  <div className="flex justify-center gap-1 mb-4">
                    {Array.from({ length: testi.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="#D4AF37" className="text-gold" />
                    ))}
                  </div>
                  <p className="text-white/80 font-playfair text-base md:text-xl italic leading-relaxed mb-6">
                    "{testi.review}"
                  </p>
                  <h4 className="text-gold font-poppins text-xs uppercase tracking-widest font-bold">
                    {testi.client_name}
                  </h4>
                  <span className="text-[10px] text-luxury-muted uppercase tracking-wider block mt-1">Verified Client</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. CALL TO ACTION CONTACT INFO SECTION */}
      <section className="py-20 bg-luxury-black relative text-center border-b border-gold/10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-white uppercase mb-6 leading-tight">
            Ready to Begin <span className="text-gold-gradient font-semibold">Your Legacy?</span>
          </h2>
          <p className="text-luxury-muted font-poppins text-sm md:text-base max-w-xl mx-auto mb-8 font-light">
            Contact our senior consultants to schedule a private call. Let's build your custom design proposal.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              to="/contact"
              className="bg-gold-gradient text-luxury-black font-semibold uppercase tracking-widest text-xs px-8 py-4 rounded-sm shadow-gold-glow hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center"
            >
              Schedule Consultation
            </Link>
            <a
              href={`https://wa.me/919876543210?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20your%20event%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-outline px-8 py-4 text-xs font-semibold uppercase tracking-widest rounded-sm w-full sm:w-auto text-center"
            >
              Direct WhatsApp Query
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
