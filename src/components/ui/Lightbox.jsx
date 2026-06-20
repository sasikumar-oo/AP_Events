import React, { useEffect } from 'react'
import { X, Play, ChevronLeft, ChevronRight } from 'lucide-react'

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
      // Instagram reels embed format
      let embedUrl = media_url
      if (!embedUrl.endsWith('/embed')) {
        // Strip trailing slash if present then append /embed
        embedUrl = `${embedUrl.replace(/\/$/, '')}/embed`
      }
      return (
        <div className="relative w-full max-w-sm h-[75vh] glass-card overflow-hidden rounded-md border border-gold/30">
          <iframe
            src={embedUrl}
            title={title || 'Instagram Reel'}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            scrolling="no"
            allowTransparency="true"
          />
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
