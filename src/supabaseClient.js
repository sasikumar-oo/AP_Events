import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate that the URL is a proper HTTP/HTTPS URL before passing to Supabase
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const supabaseConfigured = isValidUrl(rawUrl) && rawKey.length > 10

if (!supabaseConfigured) {
  console.warn(
    '[AP Events] ⚠️  Supabase is not configured yet.\n' +
    'Please create a .env file in the project root with:\n\n' +
    '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key\n\n' +
    'Get these values from: Supabase Dashboard → Project Settings → API'
  )
}

// Use valid credentials or safe fallback that won't throw an error
export const supabase = createClient(
  supabaseConfigured ? rawUrl : 'https://placeholder-project.supabase.co',
  supabaseConfigured ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
)

// Export a helper so components can check if Supabase is actually configured
export const isSupabaseReady = supabaseConfigured
