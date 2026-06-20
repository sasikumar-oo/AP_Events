import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, MapPin, ArrowLeft, Share2, Award } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function EventDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single()
        
        if (error) throw error
        if (data) {
          setEvent(data)
        }
      } catch (err) {
        console.error('Failed to load event detail:', err)
        setError('Event not found')
      } finally {
        setLoading(false)
      }
    }
    fetchEventDetail()
  }, [slug])

  // Handle sharing
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      }).catch(err => console.log(err))
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="w-10 h-10 border border-gold/25 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-luxury-bg flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-playfair text-gold font-bold mb-4 uppercase">Event Not Found</h1>
        <p className="text-luxury-muted text-sm mb-8">The project you are looking for may have been archived or removed.</p>
        <Link to="/events" className="btn-gold-outline px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-sm">
          Return To Events
        </Link>
      </div>
    )
  }

  // Dynamic JSON-LD Structured Data for Event SEO
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "startDate": event.date,
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": event.location
    },
    "image": event.image_url || 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800',
    "description": event.description,
    "organizer": {
      "@type": "Organization",
      "name": "AP Events",
      "url": "https://apevents.com"
    }
  }

  return (
    <>
      <Helmet>
        <title>{`${event.title} | AP Events`}</title>
        <meta name="description" content={event.description.substring(0, 155)} />
        <meta property="og:title" content={`${event.title} | AP Events`} />
        <meta property="og:description" content={event.description.substring(0, 155)} />
        <meta property="og:image" content={event.image_url} />
        <meta property="og:type" content="article" />
        {/* Inject Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
      </Helmet>

      {/* Hero Banner with event image */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-end justify-center bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(11, 11, 11, 0.2) 0%, rgba(11, 11, 11, 0.9) 100%), url(${event.image_url || 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1200'})` 
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-15" />

        {/* Back Link */}
        <div className="absolute top-28 left-6 md:left-12 z-20">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors text-xs uppercase tracking-widest font-semibold bg-luxury-black/60 px-4 py-2 border border-gold/15 rounded-sm backdrop-blur-sm"
          >
            <ArrowLeft size={14} /> Back to Events
          </button>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pb-12">
          <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold bg-luxury-black/80 px-3 py-1 border border-gold/15 rounded-sm">
            {event.category}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold text-white uppercase mt-4 mb-6 leading-tight tracking-wider">
            {event.title}
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-white/90 font-poppins uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gold" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gold" /> {event.location}</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 bg-luxury-bg relative">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article text */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-playfair text-gold uppercase tracking-wider font-bold border-b border-gold/15 pb-4">
              Project Brief
            </h2>
            <div className="text-white/80 leading-relaxed text-sm md:text-base whitespace-pre-line font-light space-y-4">
              {event.description}
            </div>
          </div>

          {/* Side stats card */}
          <div>
            <div className="glass-card p-6 rounded-sm border border-gold/15 space-y-6 sticky top-28">
              <h3 className="text-base font-playfair font-bold text-gold uppercase tracking-widest border-b border-gold/10 pb-3 flex items-center gap-2">
                <Award size={16} /> Details
              </h3>
              
              <div className="space-y-4 text-xs font-poppins">
                <div>
                  <span className="text-luxury-muted block uppercase tracking-wider mb-1">Commission Category</span>
                  <span className="text-white font-medium">{event.category}</span>
                </div>
                <div>
                  <span className="text-luxury-muted block uppercase tracking-wider mb-1">Execution Venue</span>
                  <span className="text-white font-medium">{event.location}</span>
                </div>
                <div>
                  <span className="text-luxury-muted block uppercase tracking-wider mb-1">Production Date</span>
                  <span className="text-white font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gold/10 flex gap-4">
                <button
                  onClick={handleShare}
                  className="w-full btn-gold-outline py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Share2 size={12} /> Share Event
                </button>
              </div>

              <Link
                to="/contact?event_type=Wedding&message=I%20saw%20your%20showcase%20for%20event:%20"
                className="w-full bg-gold-gradient text-luxury-black font-semibold py-3 rounded-sm uppercase tracking-widest text-[9px] block text-center shadow-gold-glow hover:scale-[1.02] transition-transform"
              >
                Inquire For Similar Setup
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
