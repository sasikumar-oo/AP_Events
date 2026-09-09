import React, { useState, useRef } from 'react'
import { Play, Volume2, VolumeX, Clock, Tag, ExternalLink } from 'lucide-react'
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from '../../services/videoService'

export default function YouTubeVideoCard({ video, onSelectVideo }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const clickTimeoutRef = useRef(null)

  const videoId = video.youtubeId
  const thumbnail = getYouTubeThumbnail(videoId)
  const embedUrl = getYouTubeEmbedUrl(videoId, true, isMuted)

  // Single-Click vs Double-Click Handler
  const handleClick = (e) => {
    e.stopPropagation()
    if (clickTimeoutRef.current) {
      // Double Click: Open YouTube in new tab
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
      const targetUrl = video.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    } else {
      // Single Click: Open larger modal player on website
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null
        if (onSelectVideo) {
          onSelectVideo(video)
        }
      }, 250)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsMuted(true) // reset mute state on leave
      }}
      onClick={handleClick}
      title="Single click to watch on site • Double click to open on YouTube"
      className="group relative bg-neutral-950 rounded-2xl overflow-hidden border border-white/10 hover:border-gold/60 cursor-pointer shadow-2xl transition-all duration-500 hover:shadow-gold-glow flex flex-col justify-between aspect-video select-none"
    >
      {/* Background Media Container (16:9) */}
      <div className="absolute inset-0 bg-black overflow-hidden">
        {isHovered && videoId ? (
          <iframe
            src={embedUrl}
            title={video.title}
            className="w-full h-full border-0 pointer-events-none scale-105"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
            }}
          />
        )}

        {/* Gradient Mask Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
      </div>

      {/* Top Controls Row */}
      <div className="relative z-20 p-3.5 flex items-center justify-between">
        {/* Event Category Tag */}
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[10px] font-bold font-poppins text-gold shadow-lg uppercase tracking-wider">
          <Tag size={10} />
          <span>{video.category || 'AP Events'}</span>
        </div>

        {/* Duration Tag & Mute Control on Hover */}
        <div className="flex items-center gap-2">
          {isHovered && (
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-gold/40 text-gold hover:scale-110 transition-transform shadow-lg"
              title={isMuted ? 'Click to Unmute' : 'Click to Mute'}
            >
              {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          )}

          <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-medium font-poppins text-white/90 shadow-lg">
            <Clock size={10} className="text-gold" />
            <span>{video.duration || '3:45'}</span>
          </div>
        </div>
      </div>

      {/* Center Play Icon (Shown when not hovered) */}
      {!isHovered && (
        <div className="relative z-20 flex-1 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-luxury-black/80 border border-gold/50 flex items-center justify-center text-gold shadow-gold-glow backdrop-blur-md group-hover:scale-110 transition-transform">
            <Play size={20} className="fill-gold ml-0.5" />
          </div>
        </div>
      )}

      {/* Bottom Information Row */}
      <div className="relative z-20 p-4 font-poppins space-y-1.5 mt-auto">
        <h3 className="text-xs font-playfair font-bold text-white leading-snug line-clamp-2 drop-shadow group-hover:text-gold transition-colors">
          {video.title}
        </h3>

        <div className="flex items-center justify-between text-[9.5px] text-white/70 pt-1 border-t border-white/10">
          <span className="text-gold font-semibold uppercase tracking-wider flex items-center gap-1">
            <span>Click for Modal</span> • <span>Double Click for YouTube</span>
          </span>
          <ExternalLink size={10} className="text-white/50 group-hover:text-gold" />
        </div>
      </div>
    </div>
  )
}
