import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Link as LinkIcon, Play, Image as ImageIcon, Check, AlertCircle, X } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function GalleryManager() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const [title, setTitle] = useState('')
  const [mediaType, setMediaType] = useState('image')
  const [mediaUrl, setMediaUrl] = useState('')
  const [category, setCategory] = useState('Weddings')

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      if (data) setMedia(data)
    } catch (err) {
      console.error('Failed to fetch gallery items:', err)
      setError('Could not query the gallery table.')
    } finally {
      setLoading(false)
    }
  }

  const openAddForm = () => {
    setEditingItem(null)
    setTitle('')
    setMediaType('image')
    setMediaUrl('')
    setCategory('Weddings')
    setError('')
    setFormOpen(true)
  }

  const openEditForm = (item) => {
    setEditingItem(item)
    setTitle(item.title || '')
    setMediaType(item.media_type)
    setMediaUrl(item.media_url)
    setCategory(item.category || '')
    setError('')
    setFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media asset from public displays?')) return
    try {
      const { error: delErr } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)
      if (delErr) throw delErr
      setSuccess('Media item deleted.')
      fetchGallery()
    } catch (err) {
      console.error('Delete media error:', err)
      setError('Failed to delete media.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    if (!mediaUrl.trim()) {
      setError('Please specify a Media URL.')
      setSubmitting(false)
      return
    }

    const payload = {
      title: title.trim() || null,
      media_type: mediaType,
      media_url: mediaUrl.trim(),
      category: category.trim()
    }

    try {
      if (editingItem) {
        const { error: updErr } = await supabase
          .from('gallery')
          .update(payload)
          .eq('id', editingItem.id)
        if (updErr) throw updErr
        setSuccess('Media metadata updated.')
      } else {
        const { error: insErr } = await supabase
          .from('gallery')
          .insert([payload])
        if (insErr) throw insErr
        setSuccess('Media added to gallery showcase.')
      }
      setFormOpen(false)
      fetchGallery()
    } catch (err) {
      console.error('Save media error:', err)
      setError(err.message || 'Could not save media record.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClasses = "w-full bg-luxury-black border border-gold/25 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all"

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">
            Gallery Manager
          </h1>
          <p className="text-luxury-muted text-xs font-poppins mt-1">
            Maintain high-res photos and video embed URLs categorized for filter lists.
          </p>
        </div>
        
        <button
          onClick={openAddForm}
          className="bg-gold-gradient text-luxury-black font-semibold uppercase tracking-widest text-xs px-5 py-3 rounded-sm shadow-gold-glow hover:scale-105 transition-all flex items-center gap-1.5"
        >
          <Plus size={16} /> Add Media
        </button>
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

      {/* Media Grid Showcase */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border border-gold/25 border-t-gold animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <p className="text-center py-10 text-luxury-muted text-xs font-poppins">No media assets found in gallery. Click "Add Media" to build catalog.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {media.map((item) => {
            const isVideo = item.media_type !== 'image'
            return (
              <div 
                key={item.id} 
                className="glass-card rounded-sm overflow-hidden border border-gold/15 flex flex-col justify-between"
              >
                {/* Thumbnail Previews */}
                <div className="h-44 relative bg-black flex items-center justify-center overflow-hidden border-b border-gold/10">
                  <img
                    src={
                      item.media_type === 'youtube'
                        ? `https://img.youtube.com/vi/${item.media_url.split('embed/')[1]?.split('?')[0] || item.media_url.split('v=')[1]?.split('&')[0]}/hqdefault.jpg`
                        : item.media_type === 'instagram'
                        ? 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=300'
                        : item.media_url
                    }
                    alt={item.title || 'Asset'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=300'
                    }}
                  />
                  
                  {/* Media Type Badge Overlay */}
                  <span className="absolute top-2 left-2 bg-luxury-black/90 border border-gold/30 p-1 rounded-sm text-gold text-[10px]">
                    {item.media_type === 'image' ? <ImageIcon size={12} /> : <Play size={12} className="fill-gold" />}
                  </span>
                </div>

                {/* Info and Actions */}
                <div className="p-4 space-y-3 font-poppins">
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase tracking-wider line-clamp-1">
                      {item.title || 'AP Events Design'}
                    </h4>
                    <span className="text-[9px] text-gold uppercase tracking-widest font-semibold block mt-1">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gold/10 gap-2">
                    <span className="text-[9px] text-luxury-muted uppercase tracking-wider block line-clamp-1 shrink">
                      Type: {item.media_type}
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditForm(item)}
                        className="p-1.5 border border-gold/20 hover:border-gold hover:bg-gold/10 text-gold rounded-sm transition-all"
                        title="Edit asset"
                      >
                        <Edit2 size={10} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-red-400 rounded-sm transition-all"
                        title="Delete asset"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CRUD MODAL OVERLAY */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md rounded-sm border border-gold/25 p-8 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 text-luxury-muted hover:text-gold transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-playfair text-xl font-bold uppercase tracking-wider text-white border-b border-gold/15 pb-4 mb-6">
              {editingItem ? 'Edit Media Details' : 'Add New Media Asset'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">Asset Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Elegant Mandap Archway Setup"
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">Media Format</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="w-full bg-luxury-black border border-gold/25 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                  >
                    <option value="image" className="bg-luxury-black">Photo Link</option>
                    <option value="youtube" className="bg-luxury-black">YouTube Embed</option>
                    <option value="instagram" className="bg-luxury-black">Instagram Reel</option>
                    <option value="video" className="bg-luxury-black">Raw Video MP4</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">Category Tag</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-luxury-black border border-gold/25 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                  >
                    {[
                      'Weddings', 'Corporate Events', 'College Functions', 'Birthday Parties', 
                      'Temple Events', 'Chenda Melam', 'DJ Music', 'Photography', 
                      'Balloon Decoration', 'Event Decoration', 'Welcome Hostesses', 
                      'Bridal Makeup', 'Security Services', 'Dhol & Band Players'
                    ].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">Media URL *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold/60 pointer-events-none">
                    <LinkIcon size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or youtube/embed/..."
                    className="w-full bg-luxury-black border border-gold/25 rounded pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all"
                  />
                </div>
                <span className="text-[9px] text-luxury-muted mt-1.5 block leading-normal">
                  Note: For YouTube, copy the embed link or watch URL. For Reels, copy the post share URL.
                </span>
              </div>

              <div className="pt-4 border-t border-gold/15 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-widest font-semibold text-luxury-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gold-gradient text-luxury-black font-semibold uppercase tracking-widest text-xs px-5 py-2 rounded-sm shadow-gold-glow disabled:opacity-50 transition-all flex items-center justify-center min-w-[90px]"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}
