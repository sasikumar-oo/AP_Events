import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Sparkles, Heart, Briefcase, GraduationCap, Cake,
  Music, Camera, Gift, Users, ShieldAlert, Award,
  CheckCircle2, ArrowRight, ChevronRight
} from 'lucide-react'

import { supabase } from '../supabaseClient'
import { servicesData } from '../data/servicesData'
import { parseImageUrl } from '../services/instagramService'

export default function Services() {
  const [activeTab, setActiveTab] = useState('All')
  const [servicesList, setServicesList] = useState([])
  const [loading, setLoading] = useState(true)

  const serviceCategories = ['All', 'Signature Events', 'Entertainment', 'Design & Decor', 'VIP Operations']

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const { data } = await supabase.from('site_settings').select('*').eq('key', 'custom_services').maybeSingle()
        if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
          setServicesList(data.value.map(s => ({
            title: s.title,
            category: s.category || 'Signature Events',
            desc: s.shortDesc || s.fullDesc || '',
            features: s.features || ['Luxury Event Architecture', 'VIP Hospitality'],
            img: parseImageUrl(s.heroImage || s.img),
            slug: s.slug || s.id || s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            icon: s.category === 'Entertainment' ? <Music size={18} /> : s.category === 'VIP Operations' ? <ShieldAlert size={18} /> : s.category === 'Design & Decor' ? <Sparkles size={18} /> : <Heart size={18} />
          })))
        } else {
          setServicesList(defaultServices)
        }
      } catch (err) {
        setServicesList(defaultServices)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const defaultServices = [
    {
      title: 'Weddings & Royal Celebrations',
      slug: 'wedding-planning',
      category: 'Signature Events',
      desc: 'Regal mandap configurations, customized seating layouts, elite hospitality management, and traditional ritual planning.',
      features: ['Palace Partnerships', 'Couture Floral Designs', 'VIP Guest Coordination'],
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      icon: <Heart size={18} />
    },
    {
      title: 'Corporate Galas & Summits',
      slug: 'corporate-events',
      category: 'Signature Events',
      desc: 'Annual general meetings, leadership conclaves, product launch stages, press configurations, and executive dining setups.',
      features: ['Full AV/LED Setup', 'Hostess Management', 'VIP Lounge Design'],
      img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
      icon: <Briefcase size={18} />
    },
    {
      title: 'College Fest & Youth Festivals',
      slug: 'college-functions',
      category: 'Signature Events',
      desc: 'High-energy cultural festivals, annual day celebrations, celebrity band setups, and strict safety coordinates.',
      features: ['Large Concert Stages', 'Sound & Line Array Systems', 'Crowd Safety Barriers'],
      img: 'https://images.unsplash.com/photo-1523580494863-6f30312245a4?auto=format&fit=crop&q=80&w=800',
      icon: <GraduationCap size={18} />
    },
    {
      title: 'Luxury Birthday Parties',
      slug: 'birthday-parties',
      category: 'Signature Events',
      desc: 'Curated theme birthday parties, premium desserts setups, balloon backdrops, and acoustic musicians.',
      features: ['Bespoke Cake Tables', 'Fun Interactive Stalls', 'Kids Theme Customizations'],
      img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
      icon: <Cake size={18} />
    },
    {
      title: 'Temple Festivals & Utsavam',
      slug: 'temple-events',
      category: 'Signature Events',
      desc: 'Traditional temple stage settings, divine illumination setups, and comprehensive administrative licensing support.',
      features: ['Spiritual Backdrops', 'Festive Lightings', 'Cultural Coordination'],
      img: 'https://images.unsplash.com/photo-1609137144814-7222384a51e6?auto=format&fit=crop&q=80&w=800',
      icon: <Award size={18} />
    },
    {
      title: 'Chenda Melam & Percussion',
      slug: 'chenda-melam',
      category: 'Entertainment',
      desc: 'Traditional Kerala percussion configurations. Standard temple beats (Singari Melam, Panchavadyam) featuring veteran master artists.',
      features: ['Up to 150 Performers', 'Veteran Master Drummers', 'Traditional Attire Coordination'],
      img: 'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=800',
      icon: <Music size={18} />
    },
    {
      title: 'DJ Music & Club Sound',
      slug: 'dj-music',
      category: 'Entertainment',
      desc: 'Elite sound consoles, premium club lighting, LED visualizer walls, and professional sound mixers.',
      features: ['Familiar Professional DJs', 'Visualiser Projection mapping', 'Deep Bass Sound Lineups'],
      img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
      icon: <Music size={18} />
    },
    {
      title: 'Punjabi Dhol & Brass Band',
      slug: 'dhol-band',
      category: 'Entertainment',
      desc: 'Energetic Punjabi Dhol lineups, brass bands, and royal bagpipe entries for grand VIP entries.',
      features: ['Loud Festive Beats', 'Synchronised Entry Formations', 'Custom Uniform Styles'],
      img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
      icon: <Music size={18} />
    },
    {
      title: 'Candid Photography & Cinema',
      slug: 'photography',
      category: 'VIP Operations',
      desc: 'Premium candid photography, cinematic wedding trailers, drone coverage, and prompt luxury albums.',
      features: ['High-Res Raw Assets', 'Custom Leather Albums', 'Candid Reel Directors'],
      img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
      icon: <Camera size={18} />
    },
    {
      title: 'Organic Balloon Styling',
      slug: 'balloon-decoration',
      category: 'Design & Decor',
      desc: 'Metallic balloon arches, organic shapes, pastel styling, and gold foil typography setups.',
      features: ['Pastel and Chrome Palettes', 'LED Neon Sign Backdrops', 'Custom Columns & Arches'],
      img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800',
      icon: <Gift size={18} />
    },
    {
      title: 'Event Stage & Floral Decor',
      slug: 'event-decoration',
      category: 'Design & Decor',
      desc: 'Signature luxury designs featuring crystal hangings, premium backdrops, pathways lighting, and luxury seating.',
      features: ['Crystal & Glass Accents', 'Thematic Walkway Arches', 'Custom Stage Lighting grids'],
      img: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=800',
      icon: <Sparkles size={18} />
    },
    {
      title: 'Welcome Hostesses',
      slug: 'welcome-hostesses',
      category: 'VIP Operations',
      desc: 'Professional welcome hostesses in matching designer attire, ensuring premium traditional greetings (Aarti, Tilak).',
      features: ['Bilingual Welcome Staff', 'Traditional Welcoming Items', 'VIP Seating Guides'],
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
      icon: <Users size={18} />
    },
    {
      title: 'Celebrity Bridal Makeup',
      slug: 'bridal-makeup',
      category: 'VIP Operations',
      desc: 'Elite celebrity makeup artists, premium skincare products, airbrush applications, and saree draping consultants.',
      features: ['High-End Products Only', 'Airbrush Specialists', 'Pre-Bridal Consultations'],
      img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
      icon: <Sparkles size={18} />
    },
    {
      title: 'VIP Bouncers & Security',
      slug: 'security-services',
      category: 'VIP Operations',
      desc: 'Vetted bouncer squads, VIP personal security officers (PSOs), secure barricading, and professional parking controls.',
      features: ['Vetted Professional Bouncers', 'VIP Personal Protection PSOs', 'Rigorous Entry Validation'],
      img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
      icon: <ShieldAlert size={18} />
    }
  ]

  const filteredServices = activeTab === 'All'
    ? servicesList
    : servicesList.filter(s => s.category === activeTab)

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AP Events Signature Services",
    "itemListElement": servicesList.map((svc, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Service",
        "name": svc.title,
        "description": svc.desc,
        "url": `https://apevents.com/services/${svc.slug}`
      }
    }))
  }

  return (
    <>
      <Helmet>
        <title>Signature Services | AP Events Luxury Catalogue</title>
        <meta name="description" content="Explore our comprehensive suite of 14 luxury services, from royal weddings and corporate galas to traditional Chenda Melam and premium bouncers." />
        <link rel="canonical" href="https://apevents.com/services" />
        <script type="application/ld+json">{JSON.stringify(servicesJsonLd)}</script>
      </Helmet>

      {/* Header Banner */}
      <section className="relative pt-36 pb-20 bg-luxury-black border-b border-gold/15 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 space-y-3">
          <span className="text-gold font-poppins text-xs uppercase tracking-widest font-bold bg-gold/10 border border-gold/25 px-4 py-1 rounded-full inline-block">
            The Bespoke Catalogue
          </span>
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-white uppercase tracking-wider">
            Signature Services
          </h1>
          <p className="text-luxury-muted text-xs sm:text-sm font-poppins max-w-xl mx-auto font-light leading-relaxed">
            Crafting extraordinary celebrations with royal aesthetics, traditional rhythm, and flawless operational execution.
          </p>
          <div className="h-[2px] w-24 bg-gold-gradient mx-auto mt-4 rounded-full" />
        </div>
      </section>

      {/* Glassmorphism Filter Tabs Bar */}
      <section className="py-6 sm:py-10 bg-luxury-bg border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar scroll-smooth py-1 px-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2.5 bg-luxury-black/80 backdrop-blur-xl p-1.5 sm:p-2 rounded-full border border-gold/20 shadow-2xl shrink-0">
              {serviceCategories.map((cat) => {
                const count = cat === 'All' ? servicesList.length : servicesList.filter(s => s.category === cat).length
                const isActive = activeTab === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs uppercase tracking-widest font-bold rounded-full transition-all duration-300 flex items-center gap-2 shrink-0 whitespace-nowrap ${
                      isActive
                        ? 'bg-gold-gradient text-luxury-black shadow-gold-glow scale-105'
                        : 'text-white/80 hover:text-gold hover:bg-gold/10'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full transition-colors ${
                      isActive ? 'bg-luxury-black/20 text-luxury-black' : 'bg-gold/15 text-gold'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Services Grid */}
      <section className="py-20 bg-luxury-bg relative min-h-[500px]">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-28 space-y-4">
              <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              <span className="text-luxury-muted text-xs uppercase tracking-widest font-poppins">Loading Signature Offerings...</span>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-24 text-luxury-muted text-sm font-poppins">
              No packages found under <span className="text-gold font-bold">{activeTab}</span> category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((svc, i) => (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  className="group relative rounded-xl overflow-hidden bg-gradient-to-b from-luxury-card/80 via-luxury-black/95 to-luxury-black border border-gold/20 hover:border-gold/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(212,175,55,0.18)] flex flex-col justify-between h-full"
                >
                  {/* Top Subtle Gold Accent Line */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent group-hover:via-gold transition-all duration-500" />

                  {/* Cover Image Banner */}
                  <div className="h-60 sm:h-64 overflow-hidden relative">
                    <img
                      src={svc.img}
                      alt={svc.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/35 to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 bg-luxury-black/85 backdrop-blur-md border border-gold/30 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest text-gold font-poppins font-bold shadow-lg">
                      {svc.category}
                    </span>

                    {/* Glowing Icon Badge */}
                    <div className="absolute bottom-4 right-4 bg-luxury-black/85 backdrop-blur-md border border-gold/30 p-2.5 rounded-full text-gold group-hover:bg-gold group-hover:text-luxury-black transition-all duration-500 shadow-gold-glow">
                      {svc.icon}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                    <div>
                      <h3 className="text-xl font-playfair font-bold text-white uppercase tracking-wider group-hover:text-gold transition-colors duration-300">
                        {svc.title}
                      </h3>

                      <p className="text-luxury-muted text-xs leading-relaxed font-light mt-2.5 line-clamp-3">
                        {svc.desc}
                      </p>

                      {/* Highlights Bullet List as Luxury Feature Pills */}
                      <div className="space-y-2 mt-5 pt-4 border-t border-gold/10">
                        {svc.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-xs text-white/90 font-poppins bg-luxury-black/50 border border-gold/10 px-3 py-1.5 rounded-md group-hover:border-gold/25 transition-all">
                            <CheckCircle2 size={13} className="text-gold shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-gold/15 space-y-2.5">
                      <Link
                        to={`/contact?service=${encodeURIComponent(svc.title)}`}
                        className="w-full bg-gold-gradient text-luxury-black font-bold uppercase tracking-widest text-xs py-3 px-4 rounded-md shadow-gold-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                      >
                        <span>Inquire Package</span>
                        <ArrowRight size={14} />
                      </Link>

                      <Link
                        to={`/services/${svc.slug || svc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="w-full text-center block text-[10px] text-gold/80 hover:text-white uppercase tracking-widest font-semibold py-1 transition-colors"
                      >
                        View Full Package Details &rarr;
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
