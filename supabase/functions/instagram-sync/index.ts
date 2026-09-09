// Supabase Edge Function: instagram-sync
// Securely proxies Instagram Graph API calls server-side without exposing access tokens to client browsers.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const instagramToken = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')
    const instagramAccountId = Deno.env.get('INSTAGRAM_BUSINESS_ACCOUNT_ID') || '17841460804304876'

    if (!instagramToken) {
      return new Response(
        JSON.stringify({ error: 'INSTAGRAM_ACCESS_TOKEN environment variable not set on server.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 1. Query Instagram Graph API Media
    const mediaRes = await fetch(
      `https://graph.facebook.com/v26.0/${instagramAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${instagramToken}`
    )
    const mediaData = await mediaRes.json()

    if (mediaData.error) {
      return new Response(
        JSON.stringify({ error: mediaData.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, posts: mediaData.data || [] }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Edge Function Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
