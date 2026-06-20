import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Award, Compass, ShieldCheck, HeartHandshake } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function About() {
  const [content, setContent] = useState({
    title: 'Defining Luxury Event Management',
    description: 'At AP Events, we believe in bringing dreams to life with grandeur and style. Based in the heart of Kerala, we specialize in organizing high-end weddings, high-powered corporate meetings, traditional temple events featuring majestic Chenda Melam, and elegant private functions.',
    vision: 'To be the ultimate benchmark of luxury event execution, blending rich cultural heritage with contemporary modern design.',
    mission: 'Delivering unparalleled events through precision management, opulent designs, and customized client services, making every milestone a timeless memory.',
    points: [
      'Over 10 Years of Premium Industry Experience',
      'Signature Gold & Black Luxury Art Direction',
      'Comprehensive In-House Event Productions',
      '24/7 Security and VIP Hostess Services'
    ]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'about_content')
          .single()
        if (data && data.value) {
          setContent(data.value)
        }
      } catch (err) {
        console.error('Failed to load about page content settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAboutContent()
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  // Sample premium team data
  const team = [
    {
      name: 'Aditya Pillai',
      role: 'Founder & Principal Designer',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Elena Rostova',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Vikram Seth',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    }
  ]

  return (
    <>
      <Helmet>
        <title>About Us | AP Events Luxury Planners</title>
        <meta name="description" content="Discover the philosophy and executive team behind AP Events. Learn about our vision to define premium event productions with gold standards of execution." />
      </Helmet>

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 bg-luxury-black border-b border-gold/15">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">The Chronicle</span>
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-white uppercase mt-2">
            The Dynasty of AP Events
          </h1>
          <div className="h-[1px] w-24 bg-gold mx-auto mt-4" />
        </div>
      </section>

      {/* Overview Block */}
      <section className="py-24 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[450px] overflow-hidden rounded-sm border border-gold/15 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800"
              alt="Luxury planning team"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-luxury-black/30" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-4xl font-playfair font-bold text-white uppercase leading-snug">
              {content.title}
            </h2>
            <p className="text-luxury-muted text-sm md:text-base leading-relaxed font-light">
              {content.description}
            </p>

            <div className="space-y-3 pt-2">
              {content.points && content.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/95">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Vector */}
      <section className="py-20 bg-luxury-black border-y border-gold/15">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card p-10 rounded-sm border border-gold/10"
          >
            <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold mb-6 mx-auto md:mx-0">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-playfair font-bold text-gold uppercase tracking-wider mb-4">
              Our Vision
            </h3>
            <p className="text-luxury-muted text-sm leading-relaxed font-light">
              {content.vision}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card p-10 rounded-sm border border-gold/10"
          >
            <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold mb-6 mx-auto md:mx-0">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-playfair font-bold text-gold uppercase tracking-wider mb-4">
              Our Mission
            </h3>
            <p className="text-luxury-muted text-sm leading-relaxed font-light">
              {content.mission}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">Excellence Guaranteed</span>
            <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-white uppercase mt-2">
              Why We Lead The Industry
            </h2>
            <div className="h-[1px] w-24 bg-gold mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Bespoke Artistry',
                desc: 'Every detail, floral scheme, and stage config is designed exclusively for your event. No template replication.',
                icon: <Award size={22} />
              },
              {
                title: 'Supreme Concierge',
                desc: 'Dedicated single-point coordinator accessible 24/7, providing transparent management logs and checkpoints.',
                icon: <HeartHandshake size={22} />
              },
              {
                title: 'Flawless Operations',
                desc: 'Vetted list of vendors, caterers, and tech staff synchronized using automated timetables.',
                icon: <Compass size={22} />
              },
              {
                title: 'Elite Protection',
                desc: 'Professional security protocols, crowd management, and VIP escort hosts for complete safety.',
                icon: <ShieldCheck size={22} />
              }
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 rounded-sm hover:border-gold/30 hover:shadow-gold-glow transition-all duration-300">
                <div className="text-gold mb-6">{item.icon}</div>
                <h4 className="text-lg font-playfair font-bold text-white uppercase tracking-wider mb-3">
                  {item.title}
                </h4>
                <p className="text-luxury-muted text-xs leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Profiles */}
      <section className="py-24 bg-luxury-black border-t border-gold/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">The Minds</span>
            <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-white uppercase mt-2">
              Our Executive Council
            </h2>
            <div className="h-[1px] w-24 bg-gold mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center group"
              >
                <div className="w-56 h-56 rounded-full overflow-hidden border border-gold/25 mx-auto mb-6 relative group-hover:shadow-gold-glow-lg transition-all duration-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/50 to-transparent" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-white group-hover:text-gold transition-colors">
                  {member.name}
                </h3>
                <span className="text-xs text-luxury-muted uppercase tracking-wider block mt-1">
                  {member.role}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
