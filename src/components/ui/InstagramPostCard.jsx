import React, { useState } from 'react'
import { Instagram, ExternalLink, Film, Layers, Image as ImageIcon, Calendar, Eye } from 'lucide-react'
import { parseInstagramPostUrl } from '../../services/instagramService'

export default function InstagramPostCard({ post, profile, onSelectPost }) {
  const [imgError, setImgError] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  const igMeta = parseInstagramPostUrl(post.embedUrl || post.permalink || post.media_url)
  const isReel = post.media_type === 'REEL' || post.videoUrl || igMeta?.type === 'reel'
  const isCarousel = post.media_type === 'CAROUSEL_ALBUM'

  return (
    <div
      onClick={() => onSelectPost && onSelectPost(post)}
      className="group relative bg-neutral-950 rounded-2xl overflow-hidden border border-white/10 hover:border-gold/50 cursor-pointer shadow-2xl transition-all duration-500 flex flex-col justify-between aspect-[3/4]"
    >
      {/* If Instagram Embed Iframe is available */}
      {igMeta?.embedUrl && !iframeError ? (
        <div className="relative w-full h-full bg-black overflow-hidden pointer-events-none">
          <iframe
            src={igMeta.embedUrl}
            title={post.title || 'Instagram Embed Post'}
            className="w-full h-full border-0 pointer-events-none scale-105"
            scrolling="no"
            allowTransparency="true"
            onError={() => setIframeError(true)}
          />
          {/* Overlay to catch clicks for lightbox preview without breaking iframe */}
          <div className="absolute inset-0 bg-transparent z-10" />
        </div>
      ) : (
        /* Image Thumbnail View */
        <div className="relative w-full h-full bg-black overflow-hidden">
          <img
            src={post.posterUrl || post.media_url}
            alt={post.title || 'Instagram Post'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Media Type Badge (Top Left) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-bold font-poppins text-white shadow-lg">
        {isReel ? (
          <>
            <Film size={12} className="text-pink-500" />
            <span>REEL</span>
          </>
        ) : isCarousel ? (
          <>
            <Layers size={12} className="text-amber-400" />
            <span>CAROUSEL</span>
          </>
        ) : (
          <>
            <ImageIcon size={12} className="text-sky-400" />
            <span>POST</span>
          </>
        )}
      </div>

      {/* Timestamp Badge (Top Right) */}
      {post.timestamp && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[9.5px] font-medium font-poppins text-white/90 shadow-lg">
          <Calendar size={10} className="text-gold" />
          <span>{post.timestamp}</span>
        </div>
      )}

      {/* Gradient Mask Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity z-10 pointer-events-none" />

      {/* Hover Action Icon Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-luxury-black/80 border border-gold/50 flex items-center justify-center text-gold shadow-gold-glow backdrop-blur-md">
          <Eye size={20} />
        </div>
      </div>

      {/* Bottom Information Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 z-20 text-white font-poppins space-y-2">
        <p className="text-xs font-playfair font-semibold leading-snug line-clamp-2 text-white/95 drop-shadow">
          {post.caption || post.title}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[10px]">
          <span className="text-gold font-semibold uppercase tracking-wider">
            #{post.category || 'APEvents'}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation()
              window.open(post.permalink || profile?.profileUrl, '_blank')
            }}
            className="text-white hover:text-gold font-bold flex items-center gap-1 bg-white/10 hover:bg-gold/20 border border-white/20 hover:border-gold/40 px-2.5 py-1 rounded-full transition-all"
            title="View Original Post on Instagram"
          >
            Open Instagram <ExternalLink size={10} />
          </button>
        </div>
      </div>
    </div>
  )
}
