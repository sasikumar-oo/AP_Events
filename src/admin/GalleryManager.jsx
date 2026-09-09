import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Link as LinkIcon, Play, Check, AlertCircle, X, Instagram, Sparkles, RefreshCw, CheckCircle2, Youtube, ArrowUp, ArrowDown, Eye, EyeOff, Database, ShieldCheck, Clock, Hash, Radio } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { parseYouTubeUrl, DEFAULT_YOUTUBE_VIDEOS } from '../services/videoService'
import { parseInstagramProfileUrl, fetchLatestInstagramPosts, getInstagramFeedStatus, clearInstagramFeedStatus, INSTAGRAM_BUSINESS_ACCOUNT_ID } from '../services/instagramService'

export default function GalleryManager() {
  const [activeTab, setActiveTab] = useState('videos') // 'videos' or 'instagram'

  // Video Management State
  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)

  // Video Form Fields
  const [videoTitle, setVideoTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [videoCategory, setVideoCategory] = useState('Weddings')
  const [videoDuration, setVideoDuration] = useState('4:15')
  const [videoPublished, setVideoPublished] = useState(true)

  // Instagram Settings & Graph API Status State
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/ap_events_management/')
  const [instagramToken, setInstagramToken] = useState('')
  const [autoSync, setAutoSync] = useState(true)
  const [savingIg, setSavingIg] = useState(false)
  const [igSuccess, setIgSuccess] = useState('')
  const [igStatus, setIgStatus] = useState({
    status: 'Disconnected',
    last_synced: null,
    post_count: 0,
    account_id: 'Not Connected',
    handle: 'ap_events_management'
  })

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchVideos()
    fetchInstagramSettings()
  }, [])

  // 1. Fetch YouTube Videos for Admin Management
  // 1. Fetch YouTube Videos for Admin Management
  const fetchVideos = async () => {
    try {
      setLoadingVideos(true)
      setError('')
      const { data } = await supabase.from('site_settings').select('*').eq('key', 'custom_videos').maybeSingle()
      
      if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
        setVideos(data.value)
      } else {
        const defaultList = DEFAULT_YOUTUBE_VIDEOS.map((v, i) => ({
          id: v.id,
          title: v.title,
          media_type: 'youtube',
          media_url: v.youtubeUrl || v.media_url,
          category: v.category,
          duration: v.duration,
          published: v.published,
          position: i + 1
        }))
        setVideos(defaultList)
      }
    } catch (err) {
      console.log('No custom videos stored in DB, loading default catalog.')
      const defaultList = DEFAULT_YOUTUBE_VIDEOS.map((v, i) => ({
        id: v.id,
        title: v.title,
        media_type: 'youtube',
        media_url: v.youtubeUrl || v.media_url,
        category: v.category,
        duration: v.duration,
        published: v.published,
        position: i + 1
      }))
      setVideos(defaultList)
    } finally {
      setLoadingVideos(false)
    }
  }

  // Helper to persist videos array to Supabase site_settings
  const saveVideosToDb = async (updatedList) => {
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const { error: updErr } = await supabase
        .from('site_settings')
        .upsert({ key: 'custom_videos', value: updatedList, updated_at: new Date() })

      if (updErr) throw updErr
      setVideos(updatedList)
      setSuccess('Video showcase updated successfully!')
      setVideoModalOpen(false)
    } catch (err) {
      console.error('Failed saving video showcase:', err)
      setError('Could not save video changes: ' + (err.message || ''))
    } finally {
      setSubmitting(false)
    }
  }

  // 2. Fetch Instagram Configuration Settings & Live Status
  const fetchInstagramSettings = async () => {
    try {
      const { data } = await supabase.from('site_settings').select('*').eq('key', 'contact_info').maybeSingle()
      if (data && data.value) {
        if (data.value.instagram_url) {
          setInstagramUrl(data.value.instagram_url)
        } else if (data.value.instagram) {
          const handle = data.value.instagram.replace(/^@/, '').trim()
          setInstagramUrl(`https://www.instagram.com/${handle}/`)
        }
        if (data.value.instagram_access_token) {
          setInstagramToken(data.value.instagram_access_token)
        }
        if (data.value.auto_sync !== undefined) {
          setAutoSync(data.value.auto_sync)
        }
      }

      // Read current synced status metadata from site_settings
      const statusData = await getInstagramFeedStatus()
      if (statusData) {
        setIgStatus(statusData)
      }
    } catch (err) {
      console.log('No custom Instagram profile URL in site settings, using defaults.')
    }
  }

  // Save Instagram Settings & Trigger Live Sync
  const handleSaveInstagramSettings = async (e) => {
    e.preventDefault()
    setSavingIg(true)
    setIgSuccess('')
    setError('')
    try {
      const handle = parseInstagramProfileUrl(instagramUrl)
      const cleanUrl = `https://www.instagram.com/${handle}/`

      const { data } = await supabase.from('site_settings').select('*').eq('key', 'contact_info').maybeSingle()
      const currentContact = data?.value || {}
      const updatedContact = {
        ...currentContact,
        instagram: `@${handle}`,
        instagram_url: cleanUrl,
        instagram_access_token: instagramToken.trim(),
        auto_sync: autoSync,
        last_synced: new Date().toISOString()
      }

      const { error: updErr } = await supabase
        .from('site_settings')
        .upsert({ key: 'contact_info', value: updatedContact, updated_at: new Date() })

      if (updErr) throw updErr
      setInstagramUrl(cleanUrl)

      // Trigger live Graph API fetch & sync
      const syncResult = await fetchLatestInstagramPosts(handle, 10)
      setIgStatus({
        status: syncResult.status,
        last_synced: syncResult.last_synced || new Date().toISOString(),
        post_count: syncResult.post_count || 0,
        account_id: syncResult.account_id || 'Not Connected',
        handle: handle,
        posts: syncResult.posts || []
      })

      if (syncResult.status === 'Connected') {
        setIgSuccess(`Instagram Graph API connected! ${syncResult.post_count} authentic posts synced for @${handle}.`)
      } else {
        setIgSuccess(`Instagram profile URL saved (@${handle}). Graph API status: ${syncResult.status}. ${syncResult.error || ''}`)
      }
    } catch (err) {
      console.error('Failed to update Instagram settings:', err)
      setError('Could not update Instagram settings: ' + (err.message || ''))
    } finally {
      setSavingIg(false)
    }
  }

  // Clear/Disconnect Token & Invalidate Database Feed
  const handleClearInstagramToken = async () => {
    if (!window.confirm('Are you sure you want to clear/delete the Instagram Access Token and disconnect the feed?')) return
    setSavingIg(true)
    setIgSuccess('')
    setError('')
    try {
      setInstagramToken('')
      const { data } = await supabase.from('site_settings').select('*').eq('key', 'contact_info').maybeSingle()
      const currentContact = data?.value || {}
      const updatedContact = {
        ...currentContact,
        instagram_access_token: '',
        last_synced: null
      }
      await supabase
        .from('site_settings')
        .upsert({ key: 'contact_info', value: updatedContact, updated_at: new Date() })

      // Explicitly reset feed status & clear database cache
      const resetStatus = await clearInstagramFeedStatus()
      setIgStatus(resetStatus)
      setIgSuccess('Instagram access token cleared. Public feed set to Disconnected.')
    } catch (err) {
      console.error('Failed to clear token:', err)
      setError('Could not clear token: ' + (err.message || ''))
    } finally {
      setSavingIg(false)
    }
  }

  // Handle Video Form Submit (Add / Edit)
  const openAddVideoModal = () => {
    setEditingVideo(null)
    setVideoTitle('')
    setYoutubeUrl('')
    setVideoCategory('Weddings')
    setVideoDuration('3:45')
    setVideoPublished(true)
    setError('')
    setVideoModalOpen(true)
  }

  const openEditVideoModal = (v) => {
    setEditingVideo(v)
    setVideoTitle(v.title || '')
    setYoutubeUrl(v.media_url || '')
    setVideoCategory(v.category || 'Weddings')
    setVideoDuration(v.duration || '3:45')
    setVideoPublished(v.published !== false)
    setError('')
    setVideoModalOpen(true)
  }

  const handleVideoSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const yId = parseYouTubeUrl(youtubeUrl)
    if (!yId) {
      setError('Please provide a valid YouTube URL (e.g. https://www.youtube.com/watch?v=VIDEO_ID).')
      return
    }

    const videoObj = {
      id: editingVideo?.id || `vid-${Date.now()}`,
      title: videoTitle.trim() || 'AP Events Video Highlight',
      media_type: 'youtube',
      media_url: youtubeUrl.trim(),
      category: videoCategory.trim(),
      duration: videoDuration.trim() || '3:45',
      published: videoPublished
    }

    let updatedList = []
    if (editingVideo) {
      updatedList = videos.map(v => v.id === editingVideo.id ? videoObj : v)
    } else {
      updatedList = [videoObj, ...videos]
    }

    await saveVideosToDb(updatedList)
  }

  // Delete Video
  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this YouTube video highlight from Section 1?')) return
    const updatedList = videos.filter(v => v.id !== id)
    await saveVideosToDb(updatedList)
  }

  // Toggle Video Publish/Unpublish Status
  const handleTogglePublish = async (video) => {
    const updatedList = videos.map(v => v.id === video.id ? { ...v, published: !v.published } : v)
    await saveVideosToDb(updatedList)
  }

  // Reorder Videos (Move Position Up/Down)
  const handleMoveVideo = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= videos.length) return
    const updated = [...videos]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    await saveVideosToDb(updated)
  }

  const inputClasses = "w-full bg-luxury-black border border-gold/25 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all"

  return (
    <div className="space-y-8 font-poppins text-white">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">
            Gallery & Media Manager
          </h1>
          <p className="text-luxury-muted text-xs mt-1">
            Manage Section 1 YouTube Video Highlights & Section 2/3 Instagram Integration Settings.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-luxury-black p-1 rounded-lg border border-gold/20 gap-1">
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'videos' ? 'bg-gold text-luxury-black font-bold shadow-gold-glow' : 'text-white/70 hover:text-white'
            }`}
          >
            <Youtube size={14} /> Video Highlights (Section 1)
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'instagram' ? 'bg-pink-600 text-white font-bold shadow-md' : 'text-white/70 hover:text-white'
            }`}
          >
            <Instagram size={14} /> Instagram Settings (Sec 2 & 3)
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 p-4 rounded-sm text-red-400 text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 border border-gold/30 bg-gold/10 p-4 rounded-sm text-gold text-xs">
          <Check size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* TAB 1: SECTION 1 YOUTUBE VIDEO MANAGEMENT */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-luxury-black/60 p-6 rounded-xl border border-gold/20">
            <div>
              <h3 className="font-playfair text-xl font-bold uppercase tracking-wider text-white">
                Section 1: Event Videos Showcase ({videos.length})
              </h3>
              <p className="text-xs text-white/70 mt-1">
                Add YouTube Embed URLs to automatically display cinematic videos on the public Gallery page.
              </p>
            </div>

            <button
              onClick={openAddVideoModal}
              className="bg-gold-gradient text-luxury-black font-bold uppercase tracking-widest text-xs px-5 py-3 rounded-sm shadow-gold-glow hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus size={16} /> Add YouTube Video
            </button>
          </div>

          {/* Videos Grid List */}
          {loadingVideos ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 rounded-full border border-gold/25 border-t-gold animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <p className="py-8 text-luxury-muted text-xs text-center">No video highlights added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, idx) => {
                const yId = parseYouTubeUrl(video.media_url) || 'dQw4w9WgXcQ'
                const thumb = `https://img.youtube.com/vi/${yId}/hqdefault.jpg`
                return (
                  <div
                    key={video.id || idx}
                    className="glass-card rounded-xl overflow-hidden border border-gold/20 flex flex-col justify-between"
                  >
                    {/* 16:9 Thumbnail */}
                    <div className="aspect-video relative bg-black overflow-hidden border-b border-gold/10">
                      <img
                        src={thumb}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-black/80 border border-gold/30 px-2 py-0.5 rounded text-gold text-[10px] font-bold uppercase">
                        {video.category || 'Events'}
                      </span>
                      <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-white text-[10px]">
                        {video.duration || '3:45'}
                      </span>
                    </div>

                    {/* Meta & Controls */}
                    <div className="p-4 space-y-3">
                      <h4 className="text-xs font-bold font-playfair text-white line-clamp-2">
                        {video.title}
                      </h4>

                      <div className="flex items-center justify-between pt-2 border-t border-gold/10 text-xs">
                        <button
                          onClick={() => handleTogglePublish(video)}
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                            video.published !== false
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {video.published !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                          {video.published !== false ? 'Published' : 'Hidden'}
                        </button>

                        {/* Position Order & CRUD Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveVideo(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 border border-white/10 hover:border-gold text-white disabled:opacity-20 rounded"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => handleMoveVideo(idx, 'down')}
                            disabled={idx === videos.length - 1}
                            className="p-1 border border-white/10 hover:border-gold text-white disabled:opacity-20 rounded"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            onClick={() => openEditVideoModal(video)}
                            className="p-1 border border-gold/30 text-gold hover:bg-gold/10 rounded"
                            title="Edit Video"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="p-1 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded"
                            title="Delete Video"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INSTAGRAM CONFIGURATION SETTINGS & GRAPH API STATUS */}
      {activeTab === 'instagram' && (
        <div className="space-y-6">
          
          {/* Admin Status Panel */}
          <div className="glass-card p-6 rounded-xl border border-gold/30 bg-black/60 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gold/15">
              <div>
                <h3 className="font-playfair text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Instagram size={18} className="text-pink-500" /> Live Instagram Graph API Status Panel
                </h3>
                <p className="text-xs text-white/70 mt-0.5">
                  Real-time synchronization metrics for connected Instagram account <span className="text-gold font-mono font-semibold">@{igStatus.handle || 'ap_events_management'}</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md ${
                  igStatus.status === 'Connected'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-950/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-950/40'
                }`}>
                  <Radio size={12} className={`animate-pulse ${igStatus.status === 'Connected' ? 'text-emerald-400' : 'text-amber-300'}`} />
                  {igStatus.status || 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Status Metrics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-luxury-black/80 p-3.5 rounded-lg border border-gold/15">
                <div className="flex items-center gap-1.5 text-gold text-[10px] uppercase font-bold tracking-wider">
                  <ShieldCheck size={13} /> Connection Status
                </div>
                <div className="text-sm font-bold text-white mt-1 capitalize">
                  {igStatus.status === 'Connected' ? 'Active API Bridge' : 'Offline / Standard'}
                </div>
              </div>

              <div className="bg-luxury-black/80 p-3.5 rounded-lg border border-gold/15">
                <div className="flex items-center gap-1.5 text-gold text-[10px] uppercase font-bold tracking-wider">
                  <Hash size={13} /> Instagram Account ID
                </div>
                <div className="text-xs font-bold text-white mt-1 font-mono truncate" title={igStatus.account_id}>
                  {igStatus.account_id || 'Not Connected'}
                </div>
              </div>

              <div className="bg-luxury-black/80 p-3.5 rounded-lg border border-gold/15">
                <div className="flex items-center gap-1.5 text-gold text-[10px] uppercase font-bold tracking-wider">
                  <Clock size={13} /> Last Sync Time
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  {igStatus.last_synced ? new Date(igStatus.last_synced).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : 'Never'}
                </div>
              </div>

              <div className="bg-luxury-black/80 p-3.5 rounded-lg border border-gold/15">
                <div className="flex items-center gap-1.5 text-gold text-[10px] uppercase font-bold tracking-wider">
                  <Database size={13} /> Synced Posts Count
                </div>
                <div className="text-sm font-bold text-emerald-400 mt-1">
                  {igStatus.post_count || 0} / 10 Posts
                </div>
              </div>
            </div>
          </div>

          {/* Form Settings */}
          <div className="glass-card p-6 sm:p-8 rounded-xl border border-gold/30 bg-gradient-to-r from-luxury-black via-black to-luxury-black relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6 max-w-3xl">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-widest">
                <Instagram size={18} /> Instagram Account & Graph API Token Settings
              </div>

              <h3 className="font-playfair text-2xl font-bold text-white uppercase tracking-wide">
                Configure @ap_events_management Integration
              </h3>

              <p className="text-xs text-white/80 leading-relaxed font-light">
                Enter your official Instagram profile URL below. If you have an Instagram Graph API Access Token, paste it below for direct live syncing.
              </p>

              <form onSubmit={handleSaveInstagramSettings} className="space-y-4 pt-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gold block mb-1">
                    Instagram Profile / Feed URL *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-pink-500 font-bold text-xs pointer-events-none">
                      <Instagram size={16} />
                    </span>
                    <input
                      type="url"
                      required
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://www.instagram.com/ap_events_management/"
                      className="w-full bg-luxury-black border border-gold/30 rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-gold transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-luxury-muted mt-1.5 leading-relaxed">
                    Target account handle: <span className="text-gold font-mono">@ap_events_management</span>
                  </p>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gold block mb-1">
                    Instagram Graph API Access Token (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold/60 pointer-events-none">
                      <ShieldCheck size={16} />
                    </span>
                    <input
                      type="password"
                      value={instagramToken}
                      onChange={(e) => setInstagramToken(e.target.value)}
                      placeholder="IGQJ..."
                      className="w-full bg-luxury-black border border-gold/30 rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-gold font-mono transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-luxury-muted mt-1.5 leading-relaxed">
                    Provides direct access to fetch captions, media URLs, timestamps, and permalinks straight from Meta Graph API.
                  </p>
                </div>

                {/* Auto Sync Toggle & Manual Sync Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="w-4 h-4 accent-gold cursor-pointer"
                    />
                    <span className="text-xs text-white/90 font-medium">Automatically Auto-Sync Latest 10 Instagram Posts</span>
                  </label>

                  <div className="flex items-center gap-2">
                    {instagramToken && (
                      <button
                        type="button"
                        onClick={handleClearInstagramToken}
                        disabled={savingIg}
                        className="px-4 py-2 rounded border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 size={14} /> Clear Token
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={savingIg}
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-widest px-6 py-2 rounded shadow-gold-glow disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {savingIg ? <RefreshCw size={14} className="animate-spin" /> : <Instagram size={14} />}
                      {savingIg ? 'Syncing...' : 'Sync Feed Now'}
                    </button>
                  </div>
                </div>
              </form>

              {igSuccess && (
                <div className="flex items-center gap-2 text-gold text-xs pt-1 font-semibold border-t border-gold/15 pt-3">
                  <CheckCircle2 size={14} /> {igSuccess}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* YOUTUBE VIDEO MODAL OVERLAY */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md rounded-xl border border-gold/25 p-6 relative">
            
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 text-luxury-muted hover:text-gold transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-playfair text-xl font-bold uppercase tracking-wider text-white border-b border-gold/15 pb-4 mb-6">
              {editingVideo ? 'Edit YouTube Video Highlight' : 'Add YouTube Video Highlight'}
            </h3>

            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. Royal Chenda Melam Performance"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">YouTube Embed / Watch URL *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold/60 pointer-events-none">
                    <LinkIcon size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="w-full bg-luxury-black border border-gold/25 rounded pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Category Tag</label>
                  <select
                    value={videoCategory}
                    onChange={(e) => setVideoCategory(e.target.value)}
                    className="w-full bg-luxury-black border border-gold/25 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition-all cursor-pointer"
                  >
                    {['Weddings', 'Chenda Melam', 'DJ Music', 'Temple Events', 'Dhol & Band', 'Corporate Events', 'Event Decoration'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Duration Tag</label>
                  <input
                    type="text"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    placeholder="4:25"
                    className={inputClasses}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={videoPublished}
                  onChange={(e) => setVideoPublished(e.target.checked)}
                  className="w-4 h-4 accent-gold cursor-pointer"
                />
                <span className="text-xs text-white/90">Publish immediately to Section 1</span>
              </label>

              <div className="pt-4 border-t border-gold/15 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-widest font-semibold text-luxury-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gold-gradient text-luxury-black font-bold uppercase tracking-widest text-xs px-5 py-2 rounded shadow-gold-glow disabled:opacity-50 transition-all flex items-center justify-center min-w-[90px]"
                >
                  {submitting ? 'Saving...' : 'Save Video'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
