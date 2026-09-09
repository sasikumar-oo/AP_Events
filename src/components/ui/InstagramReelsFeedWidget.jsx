import React, { useState, useRef } from 'react'
import { Instagram, Film, Play, Volume2, VolumeX, Heart, MessageCircle, Send, Music, ExternalLink, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function InstagramReelsFeedWidget({ posts, profile, onSelectReel }) {
  const [activeMuted, setActiveMuted] = useState(true)
  const scrollContainerRef = useRef(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full bg-luxury-black/90 rounded-2xl border border-gold/25 p-6 sm:p-8 space-y-6 shadow-2xl font-poppins relative overflow-hidden">
      
      {/* Widget Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 shadow-gold-glow shrink-0">
            <img
              src={profile?.avatar || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150'}
              alt={profile?.handle}
              className="w-full h-full rounded-full object-cover border border-black"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white uppercase tracking-wider">
                @{profile?.handle || 'ap_events_management'}
              </span>
              <CheckCircle2 size={16} className="text-sky-400 fill-sky-400 stroke-black" />
            </div>
            <span className="text-xs text-gold font-semibold uppercase tracking-wider block mt-0.5">
              Live Instagram Reels Feed Widget
            </span>
          </div>
        </div>

        {/* Action Controls: Sound Toggle & Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveMuted(!activeMuted)}
            className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 hover:border-gold text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {activeMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{activeMuted ? 'Unmute All' : 'Mute All'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-luxury-black border border-white/20 text-white hover:text-gold hover:border-gold transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-luxury-black border border-white/20 text-white hover:text-gold hover:border-gold transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 9:16 Mobile Phone Reels Feed Slider Container */}
      {posts.length === 0 ? (
        <div className="py-12 text-center space-y-3 border border-dashed border-white/10 rounded-xl bg-black/40">
          <Instagram size={36} className="mx-auto text-gold/60" />
          <p className="text-xs text-luxury-muted uppercase tracking-wider font-poppins px-4">
            Instagram Reels Feed Ready • Connect @{profile?.handle || 'ap_events_management'} or embed social post links in Admin Manager
          </p>
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none py-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posts.map((reel, idx) => (
            <div
              key={reel.id || idx}
              onClick={() => onSelectReel && onSelectReel(reel)}
              className="snap-center shrink-0 w-[270px] sm:w-[290px] aspect-[9/16] bg-black rounded-[28px] border-[5px] border-[#222] hover:border-gold/50 shadow-2xl overflow-hidden relative flex flex-col justify-between select-none cursor-pointer group transition-all duration-500 hover:shadow-gold-glow"
            >
              {/* Phone Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-[#111] rounded-full z-30 flex items-center justify-center pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-black/80 border border-white/10" />
              </div>

              {/* Background Video / Poster */}
              <div className="absolute inset-0 bg-black z-0">
                {reel.videoUrl ? (
                  <video
                    src={reel.videoUrl}
                    poster={reel.posterUrl}
                    loop
                    autoPlay
                    muted={activeMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={reel.posterUrl}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800'
                    }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />
              </div>

              {/* Top Bar Info */}
              <div className="relative z-20 pt-6 px-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5">
                  <Film size={14} className="text-pink-500" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-poppins">Reel</span>
                </div>

                <a
                  href={reel.permalink || profile?.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white"
                  title="Open on Instagram"
                >
                  <ExternalLink size={10} />
                </a>
              </div>

              {/* Play Button Overlay on Hover */}
              <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-luxury-black/70 border border-gold/40 text-gold flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={18} className="fill-gold ml-0.5" />
                </div>
              </div>

              {/* Right Action Icons Sidebar */}
              <div className="absolute right-2.5 bottom-12 z-20 flex flex-col items-center gap-3.5 text-white">
                <div className="flex flex-col items-center">
                  <Heart size={18} className="hover:text-red-500 transition-colors" />
                  <span className="text-[9px] font-bold">{reel.likes || '1.2K'}</span>
                </div>

                <div className="flex flex-col items-center">
                  <MessageCircle size={18} className="hover:text-gold transition-colors" />
                  <span className="text-[9px] font-bold">{reel.comments || '45'}</span>
                </div>

                <div className="w-6 h-6 rounded-full bg-neutral-900 border border-white/40 p-0.5 animate-spin-slow overflow-hidden">
                  <img
                    src={profile?.avatar}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Bottom Caption & Audio Bar */}
              <div className="relative z-20 p-3 pr-10 text-white space-y-1">
                <p className="text-[11px] font-semibold font-playfair line-clamp-2 leading-snug drop-shadow">
                  {reel.caption || reel.title}
                </p>
                <div className="flex items-center gap-1 text-[9px] text-gold font-poppins">
                  <Music size={10} className="animate-bounce" />
                  <span className="truncate">Original Audio - AP Events</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}
