import React, { useState, useEffect, useRef } from 'react'
import { X, ChevronUp, ChevronDown, Heart, MessageCircle, Send, Bookmark, Music, Volume2, VolumeX, ExternalLink, CheckCircle2, Instagram } from 'lucide-react'

export default function InstagramReelModal({ reel, reelsList, onClose, onSelectReel, handle, avatar }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeAnim, setLikeAnim] = useState(false)
  const videoRef = useRef(null)

  const currentIndex = reelsList.findIndex(r => r.id === reel?.id)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft') && currentIndex > 0) {
        onSelectReel(reelsList[currentIndex - 1])
      }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowRight') && currentIndex < reelsList.length - 1) {
        onSelectReel(reelsList[currentIndex + 1])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex, reelsList, onClose, onSelectReel])

  if (!reel) return null

  const handlePrev = () => {
    if (currentIndex > 0) onSelectReel(reelsList[currentIndex - 1])
  }

  const handleNext = () => {
    if (currentIndex < reelsList.length - 1) onSelectReel(reelsList[currentIndex + 1])
  }

  const handleDoubleTap = () => {
    setIsLiked(true)
    setLikeAnim(true)
    setTimeout(() => setLikeAnim(false), 800)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 sm:p-6 animate-fade-in backdrop-blur-md">
      {/* Background Dim Backdrop */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Top Controls: Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-luxury-black/80 border border-white/15 text-white hover:text-gold transition-colors"
        aria-label="Close modal"
      >
        <X size={22} />
      </button>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl h-[90vh] max-h-[800px] bg-luxury-black rounded-2xl border border-gold/25 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* Left Side: Vertical 9:16 Video Player */}
        <div 
          className="relative w-full md:w-[420px] h-[55%] md:h-full bg-black flex items-center justify-center overflow-hidden shrink-0 select-none cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          {reel.videoUrl ? (
            <video
              ref={videoRef}
              src={reel.videoUrl}
              poster={reel.posterUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={reel.posterUrl || reel.media_url}
              alt={reel.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Double Tap Heart Animation */}
          {likeAnim && (
            <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none animate-ping">
              <Heart size={90} className="fill-red-500 text-red-500 drop-shadow-2xl" />
            </div>
          )}

          {/* Player Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

          {/* Audio Mute Button Overlay */}
          {reel.videoUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="absolute top-4 left-4 z-30 p-2 rounded-full bg-black/60 border border-white/10 text-white hover:text-gold"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}

          {/* Bottom Video Watermark */}
          <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between text-white md:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-poppins">@{handle || 'apevents_official'}</span>
            </div>
            <a
              href={reel.instagramUrl || `https://www.instagram.com/${handle || 'apevents_official'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase font-bold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full"
            >
              View on Instagram
            </a>
          </div>
        </div>

        {/* Right Side: Instagram Reel Details & Interactive Feed Sidebar */}
        <div className="flex-1 flex flex-col justify-between p-6 bg-luxury-bg border-l border-gold/15 overflow-y-auto font-poppins">
          
          {/* Header User Profile Info */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gold/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 shrink-0">
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150'}
                    alt={handle}
                    className="w-full h-full rounded-full object-cover border border-black"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                      {handle || 'apevents_official'}
                    </span>
                    <CheckCircle2 size={14} className="text-sky-400 fill-sky-400 stroke-black" />
                  </div>
                  <span className="text-[10px] text-gold uppercase tracking-widest font-semibold block">
                    {reel.category || 'Luxury Event Showcase'}
                  </span>
                </div>
              </div>

              <a
                href={reel.instagramUrl || `https://www.instagram.com/${handle || 'apevents_official'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-gradient text-luxury-black font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-sm shadow-gold-glow hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Instagram size={14} /> Open Post
              </a>
            </div>

            {/* Reel Caption Content */}
            <div className="py-5 space-y-3">
              <h3 className="font-playfair text-xl font-bold text-white tracking-wide">
                {reel.title || 'AP Events Luxury Reel'}
              </h3>
              
              <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line font-light">
                {reel.caption}
              </p>

              {/* Music Audio Ticker */}
              <div className="flex items-center gap-2 bg-luxury-black/70 border border-gold/20 p-2.5 rounded-sm text-gold text-xs">
                <Music size={14} className="animate-spin-slow shrink-0" />
                <span className="truncate font-semibold">{reel.audioTrack || 'Original Audio - AP Events'}</span>
              </div>
            </div>
          </div>

          {/* Social Stats & Engagement Footer */}
          <div className="space-y-4 pt-4 border-t border-gold/15">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => setIsLiked(!isLiked)} 
                  className={`flex items-center gap-1.5 text-xs font-semibold ${isLiked ? 'text-red-500' : 'hover:text-red-400'}`}
                >
                  <Heart size={20} className={isLiked ? "fill-red-500 stroke-red-500" : ""} />
                  <span>{reel.likes} Likes</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <MessageCircle size={18} />
                  <span>{reel.comments} Comments</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <Send size={18} />
                  <span>{reel.shares} Shares</span>
                </div>
              </div>

              <Bookmark size={18} className="text-white/80 hover:text-gold cursor-pointer" />
            </div>

            {/* Reel Navigation Arrows (Up/Down) */}
            <div className="flex justify-between items-center bg-luxury-black p-3 rounded-sm border border-gold/10">
              <span className="text-[10px] uppercase tracking-widest text-luxury-muted">
                Reel {currentIndex + 1} of {reelsList.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="p-1.5 border border-gold/20 hover:border-gold disabled:opacity-30 rounded-sm text-gold"
                  title="Previous Reel"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === reelsList.length - 1}
                  className="p-1.5 border border-gold/20 hover:border-gold disabled:opacity-30 rounded-sm text-gold"
                  title="Next Reel"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
