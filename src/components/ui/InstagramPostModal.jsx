import React, { useEffect, useState } from 'react'
import { X, ExternalLink, CheckCircle2, Film, Image as ImageIcon, Layers, Heart, MessageCircle, Instagram } from 'lucide-react'
import { parseInstagramPostUrl } from '../../services/instagramService'

export default function InstagramPostModal({ post, onClose, profile }) {
  const [viewEmbed, setViewEmbed] = useState(true)

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

  if (!post) return null

  const handle = profile?.handle || 'ap_events_management'
  const igMeta = parseInstagramPostUrl(post.permalink || post.embedUrl || post.media_url)
  const isReel = post.media_type === 'REEL' || post.videoUrl || igMeta?.type === 'reel'
  const isCarousel = post.media_type === 'CAROUSEL_ALBUM'
  const targetPermalink = post.permalink || `https://www.instagram.com/${handle}/`

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-poppins">
      {/* Background Dim Click to Close */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-luxury-black/80 border border-white/15 text-white hover:text-gold transition-colors"
        aria-label="Close Modal"
      >
        <X size={22} />
      </button>

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[85vh] h-[650px] bg-luxury-black rounded-2xl border border-gold/25 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* Left Side: Media Stage */}
        <div className="relative w-full md:w-[55%] h-[45%] md:h-full bg-black flex items-center justify-center overflow-hidden shrink-0">
          
          {/* Media Type Badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-gold text-[10px] font-bold uppercase tracking-wider">
            {isReel ? (
              <>
                <Film size={12} className="text-pink-500" />
                <span>Reel Video</span>
              </>
            ) : isCarousel ? (
              <>
                <Layers size={12} className="text-amber-400" />
                <span>Carousel Album</span>
              </>
            ) : (
              <>
                <ImageIcon size={12} className="text-sky-400" />
                <span>Instagram Photo</span>
              </>
            )}
          </div>

          {/* Media Player / Iframe Embed */}
          {igMeta?.embedUrl && viewEmbed ? (
            <iframe
              src={igMeta.embedUrl}
              title={post.title || 'Instagram Post'}
              className="w-full h-full border-0 pt-6"
              scrolling="yes"
              allowTransparency="true"
            />
          ) : isReel && post.videoUrl ? (
            <video
              src={post.videoUrl}
              poster={post.posterUrl}
              controls
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
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
        </div>

        {/* Right Side: Details & Action */}
        <div className="flex-1 flex flex-col justify-between p-6 bg-luxury-bg border-t md:border-t-0 md:border-l border-gold/15 overflow-y-auto">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gold/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 shrink-0">
                  <img
                    src={profile?.avatar || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150'}
                    alt={handle}
                    className="w-full h-full rounded-full object-cover border border-black"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                      @{handle}
                    </span>
                    <CheckCircle2 size={14} className="text-sky-400 fill-sky-400 stroke-black" />
                  </div>
                  <span className="text-[10px] text-gold uppercase tracking-widest font-semibold block mt-0.5">
                    {post.timestamp || 'Recent Post'}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Title & Caption */}
            <div className="space-y-2">
              <h3 className="font-playfair text-lg font-bold text-white tracking-wide">
                {post.title}
              </h3>
              
              <p className="text-xs text-white/80 leading-relaxed font-light whitespace-pre-line">
                {post.caption}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-gold/15 space-y-4 mt-6">
            
            {/* Engagement Stats */}
            <div className="flex items-center justify-between text-xs text-white/80">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-red-400 font-semibold">
                  <Heart size={15} className="fill-red-500" /> {post.likes || '1.4K'} Likes
                </span>
                <span className="flex items-center gap-1 text-gold font-semibold">
                  <MessageCircle size={15} /> {post.comments || '85'} Comments
                </span>
              </div>
            </div>

            {/* "Watch on Instagram" Button */}
            <a
              href={targetPermalink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-md shadow-gold-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Instagram size={16} /> Watch on Instagram <ExternalLink size={14} />
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}
