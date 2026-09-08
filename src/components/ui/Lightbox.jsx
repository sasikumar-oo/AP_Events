import React, { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ExternalLink, Instagram } from 'lucide-react'

export default function Lightbox({ media, onClose, onPrev, onNext }) {
  useEffect(() => {
    // Lock body scrolling when lightbox is open
    document.body.style.overflow = 'hidden'
    
    // Key listeners
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onPrev, onNext])

  // Load and trigger Instagram official embed script when Instagram content is viewed
  useEffect(() => {
    if (media?.media_type === 'instagram') {
      if (!window.instgrm) {
        const script = document.createElement('script')
        script.src = 'https://www.instagram.com/embed.js'
        script.async = true
        script.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process()
          }
        }
        document.body.appendChild(script)
      } else {
        window.instgrm.Embeds.process()
      }
    }
  }, [media])

  if (!media) return null

  // Function to render the specific media type
  const renderContent = () => {
    const { media_type, media_url, title } = media

    if (media_type === 'youtube') {
      // Helper to extract video ID or format URL
      let embedUrl = media_url
      if (media_url.includes('watch?v=')) {
        const videoId = media_url.split('v=')[1]?.split('&')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (media_url.includes('youtu.be/')) {
        const videoId = media_url.split('youtu.be/')[1]?.split('?')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (media_url.includes('shorts/')) {
        const videoId = media_url.split('shorts/')[1]?.split('?')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      }

      return (
        <div className="relative w-full max-w-4xl aspect-video glass-card overflow-hidden rounded-md border border-gold/30">
          <iframe
            src={embedUrl}
            title={title || 'YouTube Video'}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    if (media_type === 'instagram') {
      // Format clean Instagram permalink and embed URL
      let rawUrl = (media_url || '').trim()
      // Remove trailing /embed or query parameters for direct link
      let cleanPermalink = rawUrl
        .replace(/\/embed\/?.*$/i, '')
        .replace(/\/$/, '')
      if (!cleanPermalink.startsWith('http')) {
        cleanPermalink = `https://${cleanPermalink}`
      }

      // Standard Instagram embed URL format
      const embedUrl = `${cleanPermalink}/embed`

      return (
        <div className="relative w-full max-w-md glass-card rounded-md border border-gold/30 flex flex-col items-center overflow-hidden shadow-2xl">
          {/* Top Instagram Header Bar */}
          <div className="w-full bg-luxury-black/90 border-b border-gold/15 px-4 py-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Instagram size={18} className="text-pink-500 shrink-0" />
              <span className="text-xs font-poppins font-semibold text-white truncate max-w-[200px]">
                {title || 'Instagram Media'}
              </span>
            </div>
            <a
              href={cleanPermalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase font-bold tracking-wider text-gold hover:text-white flex items-center gap-1 bg-gold/10 border border-gold/30 px-2.5 py-1 rounded-sm transition-colors shrink-0"
            >
              Open <ExternalLink size={10} />
            </a>
          </div>

          {/* Embed Container */}
          <div className="relative w-full h-[65vh] min-h-[420px] bg-black/80 flex items-center justify-center overflow-hidden">
            <iframe
              src={embedUrl}
              title={title || 'Instagram Reel'}
              className="w-full h-full border-0"
              scrolling="no"
              allowTransparency="true"
              allow="encrypted-media"
            />
          </div>

          {/* Bottom Action Footer for direct access if embed is restricted by Instagram policy */}
          <div className="w-full bg-luxury-black/95 border-t border-gold/15 p-3.5 text-center z-10 space-y-2">
            <p className="text-[10px] text-luxury-muted font-poppins">
              If Instagram restricts frame playback in your browser:
            </p>
            <a
              href={cleanPermalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white text-xs font-bold px-5 py-2 rounded-sm shadow-gold-glow transition-all uppercase tracking-wider"
            >
              <Instagram size={14} /> Watch Directly on Instagram <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )
    }

    if (media_type === 'video') {
      return (
        <div className="relative w-full max-w-4xl aspect-video glass-card overflow-hidden rounded-md border border-gold/30">
          <video
            src={media_url}
            controls
            autoPlay
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        </div>
      )
    }

    // Default: Image
    return (
      <div className="relative max-w-4xl max-h-[85vh] glass-card overflow-hidden rounded-md border border-gold/30">
        <img
          src={media_url}
          alt={title || 'Gallery Image'}
          className="max-w-full max-h-[80vh] object-contain block mx-auto"
        />
        {title && (
          <div className="bg-luxury-black/90 border-t border-gold/15 py-3 px-4 text-center">
            <p className="font-playfair text-gold text-sm tracking-wider uppercase font-semibold">
              {title}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
      {/* Background click close */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/75 hover:text-gold transition-colors duration-300 p-2 rounded-full bg-luxury-black/50 border border-white/10 hover:border-gold/30 z-50"
        aria-label="Close Lightbox"
      >
        <X size={24} />
      </button>

      {/* Left Navigation */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 md:left-8 text-white/75 hover:text-gold transition-colors duration-300 p-3 rounded-full bg-luxury-black/50 border border-white/10 hover:border-gold/30 z-50 hover:scale-105"
          aria-label="Previous Media"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Right Navigation */}
      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 md:right-8 text-white/75 hover:text-gold transition-colors duration-300 p-3 rounded-full bg-luxury-black/50 border border-white/10 hover:border-gold/30 z-50 hover:scale-105"
          aria-label="Next Media"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Main Content Pane */}
      <div className="relative z-10 w-full flex items-center justify-center animate-fade-in">
        {renderContent()}
      </div>
    </div>
  )
}

