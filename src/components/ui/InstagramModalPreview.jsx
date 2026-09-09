import React, { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight, ExternalLink, CheckCircle2, Film, Image as ImageIcon, Layers, Heart, MessageCircle, Volume2, VolumeX, Play, Instagram } from 'lucide-react'
import { parseInstagramPostUrl } from '../../services/instagramService'

export default function InstagramModalPreview({ post, postsList, onClose, onSelectPost, profile }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [viewMode, setViewMode] = useState('embed') // 'embed' or 'media'
  const videoRef = useRef(null)

  const currentIndex = postsList.findIndex(p => p.id === post?.id)
  const igMeta = parseInstagramPostUrl(post?.embedUrl || post?.permalink || post?.media_url)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelectPost(postsList[currentIndex - 1])
      }
      if (e.key === 'ArrowRight' && currentIndex < postsList.length - 1) {
        onSelectPost(postsList[currentIndex + 1])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex, postsList, onClose, onSelectPost])

  if (!post) return null

  const handlePrev = () => {
    if (currentIndex > 0) onSelectPost(postsList[currentIndex - 1])
  }

  const handleNext = () => {
    if (currentIndex < postsList.length - 1) onSelectPost(postsList[currentIndex + 1])
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const isReel = post.media_type === 'REEL' || post.videoUrl || igMeta?.type === 'reel'
  const isCarousel = post.media_type === 'CAROUSEL_ALBUM'

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-poppins">
      {/* Background Dim click to close */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-luxury-black/80 border border-white/15 text-white hover:text-gold transition-colors"
        aria-label="Close Preview"
      >
        <X size={22} />
      </button>

      {/* Modal Card Pane */}
      <div className="relative z-10 w-full max-w-4xl max-h-[85vh] h-[650px] bg-luxury-black rounded-2xl border border-gold/25 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* Left Side: Media / Live Embed Stage */}
        <div className="relative w-full md:w-[55%] h-[45%] md:h-full bg-black flex items-center justify-center overflow-hidden shrink-0">
          
          {/* View Mode Toggle Controls (Top Left) */}
          <div className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-black/80 backdrop-blur-md border border-white/15 p-1 rounded-full text-[10px] font-bold">
            <button
              onClick={() => setViewMode('embed')}
              className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                viewMode === 'embed'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Instagram size={12} />
              <span>Live Embed</span>
            </button>
            <button
              onClick={() => setViewMode('media')}
              className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                viewMode === 'media'
                  ? 'bg-gold text-luxury-black font-bold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Film size={12} />
              <span>Media</span>
            </button>
          </div>

          {/* Stage View Content */}
          {viewMode === 'embed' && igMeta?.embedUrl ? (
            <div className="w-full h-full bg-black flex items-center justify-center pt-8">
              <iframe
                src={igMeta.embedUrl}
                title={post.title || 'Instagram Post Embed'}
                className="w-full h-full border-0"
                scrolling="yes"
                allowTransparency="true"
              />
            </div>
          ) : isReel && post.videoUrl ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={post.videoUrl}
                poster={post.posterUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 z-30 p-2 rounded-full bg-black/60 border border-white/15 text-white hover:text-gold"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          ) : (
            <img
              src={post.posterUrl || post.media_url}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
              }}
            />
          )}

          {/* Left/Right Prev/Next Overlay Arrows */}
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="pointer-events-auto p-2 rounded-full bg-black/60 border border-white/15 text-white hover:text-gold disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === postsList.length - 1}
              className="pointer-events-auto p-2 rounded-full bg-black/60 border border-white/15 text-white hover:text-gold disabled:opacity-20 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Side: Post Info & Actions */}
        <div className="flex-1 flex flex-col justify-between p-6 bg-luxury-bg border-t md:border-t-0 md:border-l border-gold/15 overflow-y-auto">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gold/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg p-[1.5px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 shrink-0">
                  <img
                    src={profile?.avatar || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150'}
                    alt={profile?.handle}
                    className="w-full h-full rounded-md object-cover border border-black"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                      {profile?.handle || 'ap_events_management'}
                    </span>
                    <CheckCircle2 size={14} className="text-sky-400 fill-sky-400 stroke-black" />
                  </div>
                  <span className="text-[10px] text-gold uppercase tracking-widest font-semibold block mt-0.5">
                    {post.timestamp || 'Recent Post'}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Caption Details */}
            <div className="space-y-3">
              <h3 className="font-playfair text-lg font-bold text-white tracking-wide">
                {post.title}
              </h3>
              
              <p className="text-xs text-white/80 leading-relaxed font-light whitespace-pre-line">
                {post.caption}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-gold/15 space-y-4">
            
            {/* Social Engagement Stats */}
            <div className="flex items-center justify-between text-xs text-white/80">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-red-400 font-semibold">
                  <Heart size={16} className="fill-red-500" /> {post.likes || '1.4K'} Likes
                </span>
                <span className="flex items-center gap-1 text-gold font-semibold">
                  <MessageCircle size={16} /> {post.comments || '42'} Comments
                </span>
              </div>

              <span className="text-[10px] text-luxury-muted uppercase tracking-widest">
                {currentIndex + 1} of {postsList.length}
              </span>
            </div>

            {/* View Original Post Button */}
            <a
              href={post.permalink || profile?.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-md shadow-gold-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              View Original Post On Instagram <ExternalLink size={14} />
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}
