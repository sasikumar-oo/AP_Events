import React, { useState, useRef } from 'react'
import { Heart, MessageCircle, Send, Bookmark, Music, Play, Volume2, VolumeX, ExternalLink, CheckCircle2 } from 'lucide-react'

export default function InstagramReelFrame({ reel, handle, avatar, onOpenModal }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(reel.likes || '12.4K')
  const videoRef = useRef(null)

  const togglePlay = (e) => {
    e.stopPropagation()
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(err => {
        console.warn('Video play prevented:', err)
      })
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleLike = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <div 
      className="group relative w-full max-w-[310px] mx-auto aspect-[9/16] bg-black rounded-[32px] border-[6px] border-[#252525] shadow-2xl overflow-hidden flex flex-col justify-between select-none hover:border-gold/50 transition-all duration-500 hover:shadow-gold-glow cursor-pointer"
      onClick={() => onOpenModal && onOpenModal(reel)}
    >
      {/* Mobile Top Camera Notch / Bezel */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#111] rounded-full z-30 flex items-center justify-center pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-black/80 border border-white/10" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60 ml-2" />
      </div>

      {/* Background Video / Poster */}
      <div className="absolute inset-0 z-0 bg-black">
        {reel.videoUrl ? (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            poster={reel.posterUrl}
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={reel.posterUrl || reel.media_url}
            alt={reel.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}

        {/* Gradient overlays for Instagram readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* Top Header Overlay: Profile Info & Play/Mute Controls */}
      <div className="relative z-20 pt-7 px-3.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150'}
              alt={handle || 'apevents_official'}
              className="w-full h-full rounded-full object-cover border border-black"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold font-poppins text-white tracking-tight leading-none">
                @{handle || 'apevents_official'}
              </span>
              <CheckCircle2 size={11} className="text-sky-400 fill-sky-400 stroke-black" />
            </div>
            <span className="text-[9px] text-white/70 font-poppins leading-tight mt-0.5">
              Reel • {reel.category || 'AP Events'}
            </span>
          </div>
        </div>

        {/* Mute/Unmute & Direct Instagram Button */}
        <div className="flex items-center gap-1.5">
          {reel.videoUrl && (
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:text-gold transition-colors"
              title={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          )}

          <a
            href={reel.instagramUrl || `https://www.instagram.com/${handle || 'apevents_official'}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white hover:opacity-90 transition-opacity"
            title="View on Instagram"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Center Play Button Overlay */}
      <div 
        className="relative z-10 flex-1 flex items-center justify-center"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="w-12 h-12 rounded-full bg-luxury-black/70 border border-gold/40 text-gold flex items-center justify-center backdrop-blur-md shadow-gold-glow group-hover:scale-110 transition-transform duration-300">
            <Play size={20} className="fill-gold ml-0.5" />
          </div>
        )}
      </div>

      {/* Right Side Action Icons (Native Instagram Reel Layout) */}
      <div className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-4 text-white">
        {/* Like Button */}
        <button 
          onClick={handleLike} 
          className="flex flex-col items-center group/btn focus:outline-none"
        >
          <div className={`p-2 rounded-full backdrop-blur-sm transition-transform active:scale-125 ${isLiked ? 'text-red-500' : 'text-white hover:text-red-400'}`}>
            <Heart size={22} className={isLiked ? "fill-red-500 stroke-red-500" : ""} />
          </div>
          <span className="text-[10px] font-bold font-poppins drop-shadow">{likeCount}</span>
        </button>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <div className="p-2 rounded-full text-white hover:text-gold transition-colors">
            <MessageCircle size={22} />
          </div>
          <span className="text-[10px] font-bold font-poppins drop-shadow">{reel.comments || '320'}</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <div className="p-2 rounded-full text-white hover:text-gold transition-colors">
            <Send size={20} />
          </div>
          <span className="text-[10px] font-bold font-poppins drop-shadow">{reel.shares || '1.1K'}</span>
        </div>

        {/* Bookmark */}
        <div className="p-2 rounded-full text-white hover:text-gold transition-colors">
          <Bookmark size={20} />
        </div>

        {/* Spinning Vinyl Audio Disc */}
        <div className="w-7 h-7 rounded-full bg-neutral-900 border-2 border-white/40 p-1 animate-spin-slow overflow-hidden">
          <img
            src={avatar || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150'}
            alt="Audio Disc"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Content Overlay: Caption & Music Ticker */}
      <div className="relative z-20 p-3.5 pr-14 text-white space-y-1.5">
        {/* Caption Title */}
        <p className="text-xs font-semibold font-playfair tracking-wide text-white line-clamp-2 leading-snug drop-shadow-md">
          {reel.title || reel.caption}
        </p>

        {/* Category Tag */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] uppercase tracking-wider font-bold text-gold bg-gold/15 border border-gold/30 px-2 py-0.5 rounded-full">
            #{reel.category || 'LuxuryEvents'}
          </span>
        </div>

        {/* Scrolling Audio Track Bar */}
        <div className="flex items-center gap-1.5 text-[10px] text-white/90 font-poppins overflow-hidden pt-0.5">
          <Music size={11} className="shrink-0 text-gold animate-bounce" />
          <div className="truncate text-[9.5px]">
            {reel.audioTrack || 'Original Audio - AP Events'}
          </div>
        </div>
      </div>
    </div>
  )
}
