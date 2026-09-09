// Video Service for YouTube & Event Highlights
import { supabase } from '../supabaseClient'

/**
 * Extracts 11-character YouTube video ID from various link formats
 * e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *      https://youtu.be/dQw4w9WgXcQ
 *      https://www.youtube.com/embed/dQw4w9WgXcQ
 */
export function parseYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return null
  let str = url.trim().replace(/^["']|["']$/g, '')
  
  // Support youtube.com/shorts/, youtube.com/live/, youtu.be/, watch?v=, embed/
  const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/)
  if (match && match[1]) {
    return match[1]
  }

  // If user pasted raw 11-char ID directly
  if (/^[\w-]{11}$/.test(str)) {
    return str
  }

  return null
}

/**
 * Returns High Definition YouTube thumbnail URL
 */
export function getYouTubeThumbnail(videoId) {
  if (!videoId) return 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

/**
 * Returns YouTube Embed iframe URL with optional autoplay & mute flags
 */
export function getYouTubeEmbedUrl(videoId, autoplay = false, muted = true) {
  if (!videoId) return ''
  const autoParam = autoplay ? '1' : '0'
  const muteParam = muted ? '1' : '0'
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoParam}&mute=${muteParam}&enablejsapi=1&controls=1&rel=0&modestbranding=1`
}

// Curated 6 High-Impact AP Events YouTube Highlights Catalog
export const DEFAULT_YOUTUBE_VIDEOS = [
  {
    id: 'vid-1',
    title: 'Chenda Melam & Royal Mahabali Entry | Kerala Rhythm',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'Chenda Melam',
    duration: '4:25',
    published: true,
    position: 1,
    description: 'Traditional Singari Chenda Melam troupe performance for luxury Kerala wedding entry.'
  },
  {
    id: 'vid-2',
    title: 'Royal Mandap Stage & Golden Orchid Chandelier Setup',
    youtubeUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    youtubeId: '3JZ_D3ELwOQ',
    category: 'Weddings',
    duration: '3:50',
    published: true,
    position: 2,
    description: 'Bespoke glass mandap design with 10,000 fresh orchids and ambient crystal chandeliers.'
  },
  {
    id: 'vid-3',
    title: 'High-Energy DJ Concert Stage 4K LED Backdrop & Laser Show',
    youtubeUrl: 'https://www.youtube.com/watch?v=2g811Eo7K8U',
    youtubeId: '2g811Eo7K8U',
    category: 'DJ Music',
    duration: '5:12',
    published: true,
    position: 3,
    description: 'Intelligent beam lighting, heavy smoke effects, and 4K LED screen setup for college fest night.'
  },
  {
    id: 'vid-4',
    title: 'Temple Festival Illumination & Traditional Singari Melam',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    youtubeId: 'L_LUpnjgPso',
    category: 'Temple Events',
    duration: '6:15',
    published: true,
    position: 4,
    description: 'Night festival illumination and traditional temple rhythm ensemble.'
  },
  {
    id: 'vid-5',
    title: 'Punjabi Dhol Baraat Procession Troupe Entry',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    youtubeId: 'fJ9rUzIMcZQ',
    category: 'Dhol & Band',
    duration: '3:18',
    published: true,
    position: 5,
    description: 'High-energy Punjabi Dhol performers elevating the groom baraat procession.'
  },
  {
    id: 'vid-6',
    title: 'Glass House Reception Mirrored Walkway & Floral Arches',
    youtubeUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    youtubeId: 'JGwWNGJdvx8',
    category: 'Event Decoration',
    duration: '4:40',
    published: true,
    position: 6,
    description: 'Luxury mirrored entrance walkway with fairy lights and imported floral arches.'
  }
]

/**
 * Fetches published YouTube videos from Supabase database `gallery` table
 * Falls back to DEFAULT_YOUTUBE_VIDEOS if database is empty or offline
 */
export async function fetchGalleryVideos() {
  try {
    // 1. Try fetching stored custom_videos from site_settings
    const { data: customData } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'custom_videos')
      .maybeSingle()

    if (customData && customData.value && Array.isArray(customData.value) && customData.value.length > 0) {
      return customData.value.filter(v => v.published !== false).map((item, idx) => ({
        id: item.id || `vid-${idx}`,
        title: item.title || 'AP Events Video Highlight',
        youtubeUrl: item.media_url || item.youtubeUrl,
        youtubeId: parseYouTubeUrl(item.media_url || item.youtubeUrl) || 'dQw4w9WgXcQ',
        category: item.category || 'Events',
        duration: item.duration || '3:30',
        published: item.published !== false,
        position: item.position || idx + 1,
        description: item.description || ''
      }))
    }

    // 2. Fallback to gallery table if custom_videos not set
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('media_type', 'youtube')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      return data.map((item, idx) => {
        const yId = parseYouTubeUrl(item.media_url) || 'dQw4w9WgXcQ'
        return {
          id: item.id,
          title: item.title || 'AP Events Video Highlight',
          youtubeUrl: item.media_url,
          youtubeId: yId,
          category: item.category || 'Events',
          duration: item.duration || '3:30',
          published: item.published !== false,
          position: item.position || idx + 1,
          description: item.description || ''
        }
      }).filter(v => v.published)
    }
  } catch (err) {
    console.warn('Error fetching gallery videos from database, utilizing fallback catalog:', err)
  }

  return DEFAULT_YOUTUBE_VIDEOS.filter(v => v.published)
}
