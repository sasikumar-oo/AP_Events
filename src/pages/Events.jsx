import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false })
        
        if (data) {
          setEvents(data)
        }
      } catch (err) {
        console.error('Failed to query events:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const categories = ['All', ...new Set(events.map(e => e.category))]

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter(e => e.category === activeCategory)

  return (
    <>
      <Helmet>
        <title>Events Registry | AP Events Luxury Logs</title>
        <meta name="description" content="Browse our list of high-end events including royal weddings, corporate galas, and VIP private parties executed by AP Events." />
      </Helmet>

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 bg-luxury-black border-b border-gold/15">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">The Log</span>
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-white uppercase mt-2">
            Executed Projects
          </h1>
          <div className="h-[1px] w-24 bg-gold mx-auto mt-4" />
        </div>
      </section>

      {/* Filtering categories */}
      <section className="py-8 bg-luxury-bg border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold border rounded-sm transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gold text-luxury-black border-gold'
                  : 'border-gold/25 text-white/80 hover:border-gold hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Events Listings */}
      <section className="py-20 bg-luxury-bg min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 rounded-full border border-gold/25 border-t-gold animate-spin" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 text-luxury-muted">
              No executed projects logged under this category. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((evt) => (
                <motion.article
                  key={evt.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="glass-card glass-card-hover group rounded-sm overflow-hidden border border-gold/15"
                >
                  {/* Event Cover Photo */}
                  <div className="h-60 overflow-hidden relative">
                    <img
                      src={evt.image_url || 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800'}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-luxury-black/90 border border-gold/30 px-3 py-1 rounded-sm text-[9px] uppercase tracking-widest text-gold font-poppins">
                      {evt.category}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-[10px] text-luxury-muted mb-4 font-poppins uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-gold" />
                        {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-gold" />
                        {evt.location}
                      </span>
                    </div>

                    <h2 className="text-xl font-playfair font-bold text-white uppercase tracking-wider mb-3 leading-tight group-hover:text-gold transition-colors duration-300">
                      {evt.title}
                    </h2>

                    <p className="text-luxury-muted text-xs leading-relaxed line-clamp-3 mb-6 font-light">
                      {evt.description}
                    </p>

                    <Link
                      to={`/events/${evt.slug}`}
                      className="text-gold hover:text-white uppercase tracking-widest text-[10px] font-bold inline-flex items-center gap-1.5 transition-colors duration-300"
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
    </>
  )
}
