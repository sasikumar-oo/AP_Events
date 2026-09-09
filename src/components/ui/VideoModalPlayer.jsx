import React, { useEffect } from 'react'
import { X, ExternalLink, Tag, Clock, Youtube } from 'lucide-react'
import { getYouTubeEmbedUrl } from '../../services/videoService'

export default function VideoModalPlayer({ video, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!video) return null

  const embedUrl = getYouTubeEmbedUrl(video.youtubeId, true, false)

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-poppins">
      {/* Dim Background click to close */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-luxury-black/80 border border-white/15 text-white hover:text-gold transition-colors"
        aria-label="Close Player"
      >
        <X size={22} />
      </button>

      {/* Player Modal Frame */}
      <div className="relative z-10 w-full max-w-4xl bg-luxury-black rounded-2xl border border-gold/25 overflow-hidden shadow-2xl space-y-0">
        
        {/* 16:9 Video Stage */}
        <div className="w-full aspect-video bg-black relative overflow-hidden">
          <iframe
            src={embedUrl}
            title={video.title}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Video Info Details */}
        <div className="p-6 space-y-4 bg-luxury-bg border-t border-gold/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Tag size={10} /> {video.category || 'Events Showcase'}
                </span>
                <span className="text-white/60 text-xs flex items-center gap-1 font-poppins">
                  <Clock size={12} /> {video.duration || '4:25'}
                </span>
              </div>
              <h2 className="font-playfair text-xl font-bold text-white tracking-wide">
                {video.title}
              </h2>
            </div>

            <a
              href={video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shrink-0 transition-all"
            >
              <Youtube size={16} /> Open on YouTube <ExternalLink size={12} />
            </a>
          </div>

          {video.description && (
            <p className="text-xs text-white/80 leading-relaxed font-light border-t border-white/10 pt-3">
              {video.description}
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
