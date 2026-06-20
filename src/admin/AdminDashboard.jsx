import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Image, Star, Mail, ArrowRight, ShieldAlert, Clock } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    gallery: 0,
    testimonials: 0,
    enquiries: 0
  })
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)

        // 1. Fetch count totals using Supabase exact head queries
        const [
          { count: eventsCount },
          { count: galleryCount },
          { count: testimonialsCount },
          { count: enquiriesCount }
        ] = await Promise.all([
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('enquiries').select('*', { count: 'exact', head: true })
        ])

        setStats({
          events: eventsCount || 0,
          gallery: galleryCount || 0,
          testimonials: testimonialsCount || 0,
          enquiries: enquiriesCount || 0
        })

        // 2. Fetch top 5 recent enquiries
        const { data: recent } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (recent) setRecentEnquiries(recent)

      } catch (err) {
        console.error('Failed to load dashboard metrics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardStats()
  }, [])

  const statCards = [
    { name: 'Total Events', count: stats.events, icon: <Calendar size={22} />, path: '/admin/dashboard/events', color: 'border-gold/25 text-gold' },
    { name: 'Gallery Items', count: stats.gallery, icon: <Image size={22} />, path: '/admin/dashboard/gallery', color: 'border-gold/25 text-gold' },
    { name: 'Testimonials', count: stats.testimonials, icon: <Star size={22} />, path: '/admin/dashboard/content', color: 'border-gold/25 text-gold' },
    { name: 'Client Enquiries', count: stats.enquiries, icon: <Mail size={22} />, path: '/admin/dashboard/enquiries', color: 'border-gold/25 text-gold' }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border border-gold/25 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      
      {/* Welcome Row */}
      <div className="border-b border-gold/15 pb-6">
        <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">
          Operations Overview
        </h1>
        <p className="text-luxury-muted text-xs font-poppins mt-1">
          Welcome back to the AP Events control dashboard. Review real-time client integrations below.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.name}
            to={card.path}
            className={`glass-card p-6 rounded-sm border ${card.color} hover:shadow-gold-glow transition-all duration-300 flex items-center justify-between group`}
          >
            <div>
              <span className="text-luxury-muted text-xs uppercase tracking-wider font-semibold block mb-1">
                {card.name}
              </span>
              <span className="text-3xl font-playfair font-bold text-white tracking-widest block">
                {card.count}
              </span>
            </div>
            <div className="p-3 border border-gold/25 rounded bg-luxury-black/35 group-hover:bg-gold group-hover:text-luxury-black transition-colors duration-300">
              {card.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Second Row: Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Enquiries Feed (Col-span-2) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-sm border border-gold/15 space-y-6">
          <div className="flex justify-between items-baseline border-b border-gold/10 pb-4">
            <h3 className="text-lg font-playfair font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock size={18} className="text-gold" /> Recent Enquiries
            </h3>
            <Link
              to="/admin/dashboard/enquiries"
              className="text-gold hover:text-white uppercase tracking-widest text-[10px] font-bold flex items-center gap-1.5 transition-colors"
            >
              Manage Log <ArrowRight size={12} />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-center py-10 text-luxury-muted text-xs font-poppins">No pending project proposals logged.</p>
          ) : (
            <div className="divide-y divide-gold/10">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-poppins text-sm text-white font-semibold flex items-center gap-2">
                      {enq.name}
                      {enq.contacted ? (
                        <span className="border border-green-500/30 bg-green-500/10 text-[9px] uppercase px-1.5 py-0.5 rounded text-green-400 font-semibold tracking-wider">Contacted</span>
                      ) : (
                        <span className="border border-gold/30 bg-gold/10 text-[9px] uppercase px-1.5 py-0.5 rounded text-gold font-semibold tracking-wider">New</span>
                      )}
                    </h4>
                    <p className="text-xs text-luxury-muted mt-1 font-poppins uppercase tracking-wider">
                      Event: <span className="text-white/80">{enq.event_type}</span> {enq.event_date && `| Date: ${new Date(enq.event_date).toLocaleDateString()}`}
                    </p>
                    {enq.message && (
                      <p className="text-xs text-luxury-muted/75 mt-2 line-clamp-1 italic">
                        "{enq.message}"
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-luxury-muted font-poppins shrink-0">
                    {new Date(enq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support instructions */}
        <div className="glass-card p-6 rounded-sm border border-gold/15 space-y-4 text-xs font-poppins leading-relaxed text-luxury-muted">
          <h3 className="text-base font-playfair font-bold text-white uppercase tracking-wider border-b border-gold/10 pb-3 flex items-center gap-2">
            <ShieldAlert size={18} className="text-gold" /> System Notes
          </h3>
          <p>
            This administrative dashboard manages records inside Supabase PostgreSQL schema. All inputs are validated and sanitized during runtime operations.
          </p>
          <p className="font-semibold text-gold">
            Security Checklist:
          </p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Row Level Security (RLS) policies are active.</li>
            <li>Content modifications sync dynamically across public grids.</li>
            <li>Enquiries are saved with private client telephone details.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
