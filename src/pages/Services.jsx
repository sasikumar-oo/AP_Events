import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  Sparkles, Heart, Briefcase, GraduationCap, Cake, 
  Music, Camera, Gift, Users, ShieldAlert, Award
} from 'lucide-react'

export default function Services() {
  const [activeTab, setActiveTab] = useState('All')

  const serviceCategories = ['All', 'Signature Events', 'Entertainment', 'Design & Decor', 'VIP Operations']

  const services = [
    {
      title: 'Weddings',
      category: 'Signature Events',
      desc: 'Regal mandap configurations, customized seating layouts, elite hospitality management, and traditional ritual planning.',
      features: ['Palace Partnerships', 'Couture Floral Designs', 'VIP Guest Coordination'],
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
      icon: <Heart size={20} />
    },
    {
      title: 'Corporate Events',
      category: 'Signature Events',
      desc: 'Annual general meetings, leadership conclaves, product launch stages, press configurations, and executive dining setups.',
      features: ['Full AV/LED Setup', 'Hostess Management', 'VIP Lounge Design'],
      img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600',
      icon: <Briefcase size={20} />
    },
    {
      title: 'College Functions',
      category: 'Signature Events',
      desc: 'High-energy cultural festivals, annual day celebrations, celebrity band setups, and strict safety coordinates.',
      features: ['Large Concert Stages', 'Sound & Line Array Systems', 'Crowd Safety Barriers'],
      img: 'https://images.unsplash.com/photo-1523580494863-6f30312245a4?auto=format&fit=crop&q=80&w=600',
      icon: <GraduationCap size={20} />
    },
    {
      title: 'Birthday Parties',
      category: 'Signature Events',
      desc: 'Curated theme birthday parties, premium desserts setups, balloon backdrops, and acoustic musicians.',
      features: ['Bespoke Cake Tables', 'Fun Interactive Stalls', 'Kids Theme Customizations'],
      img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=600',
      icon: <Cake size={20} />
    },
    {
      title: 'Temple Events',
      category: 'Signature Events',
      desc: 'Traditional temple stage settings, divine illumination setups, and comprehensive administrative licensing support.',
      features: ['Spiritual Backdrops', 'Festive Lightings', 'Cultural Coordination'],
      img: 'https://images.unsplash.com/photo-1609137144814-7222384a51e6?auto=format&fit=crop&q=80&w=600',
      icon: <Award size={20} />
    },
    {
      title: 'Chenda Melam',
      category: 'Entertainment',
      desc: 'Traditional Kerala percussion configurations. Standard temple beats (Singari Melam, Panchavadyam) featuring veteran master artists.',
      features: ['Up to 150 Performers', 'Veteran Master Drummers', 'Traditional Attire Coordination'],
      img: 'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=600',
      icon: <Music size={20} />
    },
    {
      title: 'DJ Music',
      category: 'Entertainment',
      desc: 'Elite sound consoles, premium club lighting, LED visualizer walls, and professional sound mixers.',
      features: ['Familiar Professional DJs', 'Visualiser Projection mapping', 'Deep Bass Sound Lineups'],
      img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600',
      icon: <Music size={20} />
    },
    {
      title: 'Dhol & Band Players',
      category: 'Entertainment',
      desc: 'Energetic Punjabi Dhol lineups, brass bands, and royal bagpipe entries for grand VIP entries.',
      features: ['Loud Festive Beats', 'Synchronised Entry Formations', 'Custom Uniform Styles'],
      img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=600',
      icon: <Music size={20} />
    },
    {
      title: 'Photography',
      category: 'VIP Operations',
      desc: 'Premium candid photography, cinematic wedding trailers, drone coverage, and prompt luxury albums.',
      features: ['High-Res Raw Assets', 'Custom Leather Albums', 'Candid Reel Directors'],
      img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
      icon: <Camera size={20} />
    },
    {
      title: 'Balloon Decoration',
      category: 'Design & Decor',
      desc: 'Metallic balloon arches, organic shapes, pastel styling, and gold foil typography setups.',
      features: ['Pastel and Chrome Palettes', 'LED Neon Sign Backdrops', 'Custom Columns & Arches'],
      img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600',
      icon: <Gift size={20} />
    },
    {
      title: 'Event Decoration',
      category: 'Design & Decor',
      desc: 'Signature luxury designs featuring crystal hangings, premium backdrops, pathways lighting, and luxury seating.',
      features: ['Crystal & Glass Accents', 'Thematic Walkway Arches', 'Custom Stage Lighting grids'],
      img: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=600',
      icon: <Sparkles size={20} />
    },
    {
      title: 'Welcome Hostesses',
      category: 'VIP Operations',
      desc: 'Professional welcome hostesses in matching designer attire, ensuring premium traditional greetings (Aarti, Tilak).',
      features: ['Bilingual Welcome Staff', 'Traditional Welcoming Items', 'VIP Seating Guides'],
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
      icon: <Users size={20} />
    },
    {
      title: 'Bridal Makeup',
      category: 'VIP Operations',
      desc: 'Elite celebrity makeup artists, premium skincare products, airbrush applications, and saree draping consultants.',
      features: ['High-End Products Only', 'Airbrush Specialists', 'Pre-Bridal Consultations'],
      img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600',
      icon: <Sparkles size={20} />
    },
    {
      title: 'Security Services',
      category: 'VIP Operations',
      desc: 'Vetted bouncer squads, VIP personal security officers (PSOs), secure barricading, and professional parking controls.',
      features: ['Vetted Professional Bouncers', 'VIP Personal Protection PSOs', 'Rigorous Entry Validation'],
      img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
      icon: <ShieldAlert size={20} />
    }
  ]

  const filteredServices = activeTab === 'All' 
    ? services 
    : services.filter(s => s.category === activeTab)

  return (
    <>
      <Helmet>
        <title>Services | AP Events Luxury Packages</title>
        <meta name="description" content="Explore our comprehensive suite of 14 luxury services, from royal weddings and corporate galas to traditional Chenda Melam and premium bouncers." />
      </Helmet>

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 bg-luxury-black border-b border-gold/15">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">The Catalogue</span>
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-white uppercase mt-2">
            Signature Services
          </h1>
          <div className="h-[1px] w-24 bg-gold mx-auto mt-4" />
        </div>
      </section>

      {/* Filtering Tabs */}
      <section className="py-8 bg-luxury-bg border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-4">
          {serviceCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 text-xs uppercase tracking-widest font-semibold border rounded-sm transition-all duration-300 ${
                activeTab === cat
                  ? 'bg-gold text-luxury-black border-gold shadow-gold-glow'
                  : 'border-gold/20 text-white/80 hover:border-gold hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="glass-card glass-card-hover rounded-sm overflow-hidden flex flex-col h-full border border-gold/15"
              >
                {/* Cover Image with Category Banner */}
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={svc.img}
                    alt={svc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/30 to-transparent" />
                  
                  {/* Floating Category badge */}
                  <span className="absolute top-4 right-4 bg-luxury-black/90 border border-gold/30 px-3 py-1 rounded-sm text-[9px] uppercase tracking-widest text-gold font-poppins">
                    {svc.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-grow flex flex-col">
                  {/* Title & Icon Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-playfair font-bold text-white uppercase tracking-wider">
                      {svc.title}
                    </h3>
                    <div className="text-gold border border-gold/30 p-2 rounded-full bg-luxury-black/30">
                      {svc.icon}
                    </div>
                  </div>

                  <p className="text-luxury-muted text-xs leading-relaxed mb-6 flex-grow font-light">
                    {svc.desc}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 mb-6 border-t border-gold/10 pt-4">
                    {svc.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-white/90 font-poppins font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Link with prefilled state */}
                  <Link
                    to={`/contact?service=${encodeURIComponent(svc.title)}`}
                    className="w-full bg-transparent hover:bg-gold border border-gold/40 text-gold hover:text-luxury-black py-3 rounded-sm uppercase tracking-widest text-[10px] font-bold transition-all duration-300 text-center flex items-center justify-center gap-2"
                  >
                    Inquire For Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
