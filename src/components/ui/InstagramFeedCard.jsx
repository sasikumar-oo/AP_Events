import React, { useState } from 'react'
import { Instagram, Film, Layers, Image as ImageIcon, Calendar, Play, Music2 } from 'lucide-react'

export default function InstagramFeedCard({ post, onSelectPost }) {
  const [imgError, setImgError] = useState(false)

  const isReel = post.media_type === 'REEL' || post.videoUrl || post.media_type === 'VIDEO' || true
  const isCarousel = post.media_type === 'CAROUSEL_ALBUM'

  return (
    <div
      onClick={() => onSelectPost && onSelectPost(post)}
      className="group relative bg-neutral-950 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 hover:border-gold/60 cursor-pointer shadow-2xl transition-all duration-500 hover:shadow-gold-glow flex flex-col justify-between aspect-[9/16] select-none"
    >
      {/* Thumbnail Image / Poster */}
      <div className="relative w-full h-full bg-black overflow-hidden">
        <img
          src={post.posterUrl || post.thumbnail_url || post.media_url}
          alt={post.title || 'Instagram Reel'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={() => setImgError(true)}
        />

        {/* Gradient Overlay for Reels Caption Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20 opacity-90 group-hover:opacity-95 transition-opacity" />
      </div>

      {/* Media Type Badge (Top Left) */}
      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[9px] sm:text-[10px] font-bold font-poppins text-white shadow-lg">
        {isCarousel ? (
          <>
            <Layers size={11} className="text-amber-400" />
            <span>SLIDES</span>
          </>
        ) : (
          <>
            <Film size={11} className="text-pink-500 animate-pulse" />
            <span>REEL</span>
          </>
        )}
      </div>

      {/* Post Date (Top Right) */}
      {post.timestamp && (
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[8.5px] sm:text-[9.5px] font-medium font-poppins text-gold shadow-lg">
          <Calendar size={10} />
          <span>{post.timestamp}</span>
        </div>
      )}

      {/* Center Play Button Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 border border-gold/60 flex items-center justify-center text-gold shadow-gold-glow backdrop-blur-md">
          <Play size={20} className="fill-gold text-gold ml-0.5" />
        </div>
      </div>

      {/* Bottom Reels Profile & Caption Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-20 font-poppins space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-amber-500 to-pink-600 p-[1px] shrink-0">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <Instagram size={10} className="text-pink-400" />
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-white/90 truncate">
            @ap_events_management
          </span>
        </div>

        <p className="text-[10.5px] sm:text-[11.5px] font-medium text-white/95 leading-snug line-clamp-2 drop-shadow group-hover:text-gold transition-colors">
          {post.title || post.caption}
        </p>

        <div className="flex items-center gap-1 text-[9px] text-gold/80 pt-0.5">
          <Music2 size={10} className="animate-spin text-pink-400" style={{ animationDuration: '4s' }} />
          <span className="truncate text-[8.5px] tracking-wide">Original audio - AP Events</span>
        </div>
      </div>
    </div>
  )
}
