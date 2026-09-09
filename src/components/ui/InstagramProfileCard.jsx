import React from 'react'
import { Instagram, CheckCircle2, Users, UserCheck, Grid, ExternalLink } from 'lucide-react'

export default function InstagramProfileCard({ profile }) {
  const handle = profile?.handle || profile?.username || 'ap_events_management'
  const profileUrl = profile?.profileUrl || `https://www.instagram.com/${handle}/`
  const avatar = profile?.avatar || profile?.profile_picture_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300'
  const bio = profile?.bio || profile?.biography || '✨ Premier Event Architecture & Rhythm of Kerala\n🥁 Chenda Melam | Royal Weddings | Stage & Sound | Balloon Decor\n📞 Booking: 9150226356 / 9080717153'
  const followers = profile?.followers || profile?.followers_count || '48.2K'
  const following = profile?.following || profile?.follows_count || '312'
  const postsCount = profile?.postsCount || profile?.media_count || '284'

  return (
    <div className="w-full glass-card bg-luxury-black/90 backdrop-blur-md rounded-2xl border border-gold/30 p-6 sm:p-10 shadow-2xl font-poppins relative overflow-hidden">
      {/* Background Decorative Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-pink-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Avatar & Core Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 max-w-2xl">
          {/* Avatar Ring */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 shadow-gold-glow shrink-0">
            <img
              src={avatar}
              alt={handle}
              className="w-full h-full rounded-full object-cover border-2 border-black"
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
                @{handle}
              </h3>
              <CheckCircle2 size={20} className="text-sky-400 fill-sky-400 stroke-black" />
            </div>

            <p className="text-xs text-white/80 leading-relaxed font-light whitespace-pre-line">
              {bio}
            </p>

            {/* Profile Statistics Bar */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center gap-1.5">
                <Grid size={14} className="text-gold" />
                <span className="font-bold text-white">{postsCount}</span>
                <span className="text-luxury-muted text-[11px]">Posts</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-gold" />
                <span className="font-bold text-white">{followers}</span>
                <span className="text-luxury-muted text-[11px]">Followers</span>
              </div>

              <div className="flex items-center gap-1.5">
                <UserCheck size={14} className="text-gold" />
                <span className="font-bold text-white">{following}</span>
                <span className="text-luxury-muted text-[11px]">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Dual Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto shrink-0">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 transition-all"
          >
            <Instagram size={16} /> Follow On Instagram
          </a>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-gold/50 text-gold hover:bg-gold hover:text-luxury-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
          >
            <ExternalLink size={16} /> Open Instagram Profile
          </a>
        </div>

      </div>
    </div>
  )
}
