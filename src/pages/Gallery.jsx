import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Film, Instagram, Sparkles } from 'lucide-react'
import { fetchGalleryVideos } from '../services/videoService'
import { fetchLatestInstagramPosts, DEFAULT_INSTAGRAM_PROFILE } from '../services/instagramService'
import { supabase } from '../supabaseClient'

import YouTubeVideoCard from '../components/ui/YouTubeVideoCard'
import VideoModalPlayer from '../components/ui/VideoModalPlayer'
import InstagramProfileCard from '../components/ui/InstagramProfileCard'
import InstagramFeedCard from '../components/ui/InstagramFeedCard'
import InstagramPostModal from '../components/ui/InstagramPostModal'

export default function Gallery() {
  const [videos, setVideos] = useState([])
  const [instagramPosts, setInstagramPosts] = useState([])
  const [profile, setProfile] = useState(DEFAULT_INSTAGRAM_PROFILE)
  
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [loadingInstagram, setLoadingInstagram] = useState(true)

  // Selected Modals State
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedInstagramPost, setSelectedInstagramPost] = useState(null)

  useEffect(() => {
    loadGalleryData()
  }, [])

  const loadGalleryData = async () => {
    // 1. Fetch Instagram Settings & Profile Handle
    try {
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')

      if (settingsData) {
        const contactInfo = settingsData.find(s => s.key === 'contact_info')?.value
        if (contactInfo && contactInfo.instagram) {
          const cleanHandle = contactInfo.instagram.replace(/^@/, '').trim()
          if (cleanHandle) {
            setProfile(prev => ({
              ...prev,
              handle: cleanHandle,
              profileUrl: `https://www.instagram.com/${cleanHandle}/`
            }))
          }
        }
      }
    } catch (err) {
      console.log('Using default Instagram profile settings.')
    }

    // 2. Fetch YouTube Videos Showcase for Section 1
    try {
      setLoadingVideos(true)
      const videoList = await fetchGalleryVideos()
      setVideos(videoList)
    } catch (err) {
      console.error('Failed to load YouTube videos:', err)
    } finally {
      setLoadingVideos(false)
    }

    // 3. Fetch Latest 10 Instagram Posts & Real Profile Details for Section 2 & 3
    try {
      setLoadingInstagram(true)
      const res = await fetchLatestInstagramPosts(profile.handle, 10)
      if (res) {
        if (res.profile) {
          setProfile(res.profile)
        }
        if (res.posts && res.posts.length > 0) {
          setInstagramPosts(res.posts)
        } else {
          setInstagramPosts([])
        }
      } else {
        setInstagramPosts([])
      }
    } catch (err) {
      console.error('Failed to load Instagram posts:', err)
      setInstagramPosts([])
    } finally {
      setLoadingInstagram(false)
    }
  }

  // Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  return (
    <>
      <Helmet>
        <title>Event Highlights & Media Gallery | AP Events</title>
        <meta name="description" content="Explore AP Events cinematic highlights, wedding videos, stage shows, and latest Instagram posts from @ap_events_management." />
      </Helmet>

      <div className="min-h-screen bg-luxury-bg text-white font-poppins pt-32 pb-24 space-y-24">
        
        {/* ═══════════════════════════════════════ */}
        {/* SECTION 1: EVENT VIDEOS SHOWCASE (FIRST SECTION) */}
        {/* ═══════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 space-y-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest shadow-gold-glow">
              <Film size={14} /> Cinematic Showcase
            </div>

            <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-white tracking-wide">
              Event Highlights<span className="text-amber-500">.</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light font-poppins">
              Experience our events through cinematic highlights, wedding moments, corporate gatherings, cultural celebrations, and live performances.
            </p>
          </div>

          {/* Video Grid (3 Cols Desktop / 2 Cols Tablet / 1 Col Mobile) */}
          {loadingVideos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="aspect-video bg-luxury-black/60 border border-white/10 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-16 text-luxury-muted text-xs uppercase tracking-wider">
              No video highlights published yet.
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {videos.map(video => (
                <motion.div key={video.id} variants={itemVariants}>
                  <YouTubeVideoCard
                    video={video}
                    onSelectVideo={(v) => setSelectedVideo(v)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 2: CONNECT WITH US */}
        {/* ═══════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 space-y-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-widest">
              <Instagram size={14} /> Social Community
            </div>

            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-white tracking-wide">
              Connect With Us<span className="text-amber-500">.</span>
            </h2>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light font-poppins">
              Follow AP Events on Instagram to explore our latest weddings, corporate events, cultural programs, stage shows, and behind-the-scenes moments.
            </p>
          </div>

          {/* Instagram Profile Card Banner Component */}
          <InstagramProfileCard profile={profile} />

        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 3: INSTAGRAM REELS & POSTS FEED */}
        {/* ═══════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 space-y-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest">
              <Sparkles size={14} /> Live Feed
            </div>

            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-white tracking-wide">
              Latest From Instagram<span className="text-amber-500">.</span>
            </h2>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light font-poppins">
              Automatically synchronized with the official AP Events Instagram account (@{profile.handle}).
            </p>
          </div>

          {/* Instagram 10-Post Grid or Error Notice */}
          {loadingInstagram ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <div key={n} className="aspect-square bg-luxury-black/60 border border-white/10 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : instagramPosts.length === 0 ? (
            <div className="max-w-xl mx-auto py-12 px-6 text-center space-y-4 glass-card border border-gold/20 rounded-2xl bg-luxury-black/80 shadow-2xl font-poppins">
              <div className="w-14 h-14 mx-auto rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Instagram size={26} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-playfair text-xl font-bold text-white uppercase tracking-wider">
                  Instagram feed unavailable
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Our live Instagram connection is currently updating. Visit our official profile directly to view our latest event reels and photos.
                </p>
              </div>
              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md mt-2"
              >
                <Instagram size={14} /> View @{profile.handle} on Instagram
              </a>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
            >
              {instagramPosts.map(post => (
                <motion.div key={post.id} variants={itemVariants}>
                  <InstagramFeedCard
                    post={post}
                    onSelectPost={(p) => setSelectedInstagramPost(p)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

        </section>

        {/* ═══════════════════════════════════════ */}
        {/* MODAL POPUPS */}
        {/* ═══════════════════════════════════════ */}

        {/* 1. YouTube Video Modal Player */}
        {selectedVideo && (
          <VideoModalPlayer
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}

        {/* 2. Instagram In-Page Popup Lightbox Modal */}
        {selectedInstagramPost && (
          <InstagramPostModal
            post={selectedInstagramPost}
            profile={profile}
            onClose={() => setSelectedInstagramPost(null)}
          />
        )}

      </div>
    </>
  )
}
