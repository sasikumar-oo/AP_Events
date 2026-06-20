import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Video as VideoIcon, Play, ZoomIn, Eye } from 'lucide-react'
import { supabase } from '../supabaseClient'
import Lightbox from '../components/ui/Lightbox'

export default function Gallery() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeType, setActiveType] = useState('All') // 'All', 'image', 'video'
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (data) {
          setMedia(data)
        }
      } catch (err) {
        console.error('Failed to load gallery items:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  // Categories list
  const categories = ['All', ...new Set(media.map(m => m.category).filter(Boolean))]

  // Filter logic
  const filteredMedia = media.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    
    let matchesType = true
    if (activeType === 'image') {
      matchesType = item.media_type === 'image'
    } else if (activeType === 'video') {
      matchesType = item.media_type === 'video' || item.media_type === 'youtube' || item.media_type === 'instagram'
    }

    return matchesCategory && matchesType
  })

  // Lightbox navigation helpers
  const handlePrev = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredMedia.length - 1))
  }

  const handleNext = () => {
    setLightboxIndex((prev) => (prev < filteredMedia.length - 1 ? prev + 1 : 0))
  }

  return (
    <>
      <Helmet>
        <title>Media Gallery | AP Events Luxury Portfolios</title>
        <meta name="description" content="Immerse yourself in our visual showcase. High-resolution photo galleries and video logs detailing our premium event designs." />
      </Helmet>

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 bg-luxury-black border-b border-gold/15">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="text-gold font-poppins text-xs uppercase tracking-widest font-semibold">The Visuals</span>
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-white uppercase mt-2">
            Luxury Portfolios
          </h1>
          <div className="h-[1px] w-24 bg-gold mx-auto mt-4" />
        </div>
      </section>

      {/* Filter Options */}
      <section className="py-8 bg-luxury-bg border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          
          {/* Format Tabs (Photos vs Videos) */}
          <div className="flex bg-luxury-black p-1 border border-gold/15 rounded-sm">
            {[
              { id: 'All', label: 'All Media', icon: null },
              { id: 'image', label: 'Photos Only', icon: <ImageIcon size={14} className="mr-1.5" /> },
              { id: 'video', label: 'Videos & Reels', icon: <VideoIcon size={14} className="mr-1.5" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveType(tab.id)
                  setLightboxIndex(-1)
                }}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 flex items-center ${
                  activeType === tab.id
                    ? 'bg-gold text-luxury-black shadow-gold-glow'
                    : 'text-white/80 hover:text-gold'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setLightboxIndex(-1)
                }}
                className={`px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold border rounded-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gold/10 text-gold border-gold'
                    : 'border-white/10 text-luxury-muted hover:border-gold/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Media Grid */}
      <section className="py-20 bg-luxury-bg min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-6">
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border border-gold/25 border-t-gold rounded-full animate-spin" />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-20 text-luxury-muted text-sm uppercase tracking-wider">
              No media items available in this category.
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredMedia.map((item, idx) => {
                  const isVideo = item.media_type !== 'image'
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      key={item.id}
                      onClick={() => setLightboxIndex(idx)}
                      className="glass-card glass-card-hover group relative rounded-sm overflow-hidden aspect-square border border-gold/10 cursor-pointer"
                    >
                      {/* Image Thumbnail */}
                      <img
                        src={
                          item.media_type === 'youtube'
                            ? `https://img.youtube.com/vi/${item.media_url.split('embed/')[1]?.split('?')[0] || item.media_url.split('v=')[1]?.split('&')[0]}/hqdefault.jpg`
                            : item.media_type === 'instagram'
                            ? 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=400' // IG placeholder thumbnail
                            : item.media_url
                        }
                        alt={item.title || 'Gallery Thumbnail'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback in case YouTube URL extraction failed or standard load error
                          e.target.src = 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=400'
                        }}
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-4 transition-all duration-300 text-center">
                        <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold mb-3 bg-luxury-black/50 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-gold-glow">
                          {isVideo ? <Play size={20} className="fill-gold ml-0.5" /> : <Eye size={20} />}
                        </div>
                        
                        <p className="font-playfair text-sm uppercase tracking-wider text-white font-semibold line-clamp-1 mb-1 px-2">
                          {item.title || 'AP Events Design'}
                        </p>
                        <span className="text-[9px] uppercase tracking-widest text-gold font-poppins">
                          {item.category}
                        </span>
                      </div>

                      {/* Video indicator icon in standard state */}
                      {isVideo && (
                        <div className="absolute bottom-3 right-3 bg-luxury-black/85 border border-gold/25 p-1.5 rounded-full text-gold group-hover:opacity-0 transition-opacity">
                          <Play size={12} className="fill-gold ml-0.5" />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Rendering */}
      {lightboxIndex >= 0 && (
        <Lightbox
          media={filteredMedia[lightboxIndex]}
          onClose={() => setLightboxIndex(-1)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  )
}
