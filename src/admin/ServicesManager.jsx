import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Link as LinkIcon, Check, AlertCircle, X, Sparkles, RefreshCw, CheckCircle2, Image as ImageIcon, Briefcase, Eye, ShieldCheck, Layers, Layers3 } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { servicesData, getServiceBySlug } from '../data/servicesData'
import { parseImageUrl } from '../services/instagramService'

export default function ServicesManager() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)

  // Form Fields
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Signature Events')
  const [shortDesc, setShortDesc] = useState('')
  const [fullDesc, setFullDesc] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [galleryImages, setGalleryImages] = useState([''])
  const [features, setFeatures] = useState([''])

  useEffect(() => {
    fetchServices()
  }, [])

  // 1. Fetch Services List from Supabase database or default catalog
  const fetchServices = async () => {
    try {
      setLoading(true)
      const { data } = await supabase.from('site_settings').select('*').eq('key', 'custom_services').maybeSingle()
      if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
        setServices(data.value)
      } else {
        setServices(servicesData)
      }
    } catch (err) {
      console.log('No custom services stored in DB, displaying default services data.')
      setServices(servicesData)
    } finally {
      setLoading(false)
    }
  }

  // Save Services to Supabase DB
  const saveServicesToDb = async (updatedList) => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { error: updErr } = await supabase
        .from('site_settings')
        .upsert({ key: 'custom_services', value: updatedList, updated_at: new Date() })

      if (updErr) throw updErr
      setServices(updatedList)
      setSuccess('Service catalog updated successfully!')
      setModalOpen(false)
    } catch (err) {
      console.error('Failed saving services:', err)
      setError('Could not save service changes: ' + (err.message || ''))
    } finally {
      setSaving(false)
    }
  }

  // Open Modal for New Service
  const openAddModal = () => {
    setEditingService(null)
    setTitle('')
    setCategory('Signature Events')
    setShortDesc('')
    setFullDesc('')
    setHeroImage('')
    setGalleryImages([''])
    setFeatures(['VIP Hospitality', 'Stage Architecture'])
    setError('')
    setModalOpen(true)
  }

  // Open Modal for Edit Service
  const openEditModal = (svc) => {
    setEditingService(svc)
    setTitle(svc.title || '')
    setCategory(svc.category || 'Signature Events')
    setShortDesc(svc.shortDesc || '')
    setFullDesc(svc.fullDesc || '')
    setHeroImage(svc.heroImage || svc.img || '')
    setGalleryImages(svc.gallery && svc.gallery.length > 0 ? svc.gallery : [svc.heroImage || svc.img || ''])
    setFeatures(svc.features && svc.features.length > 0 ? svc.features : ['Signature Service'])
    setError('')
    setModalOpen(true)
  }

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Service title is required.')
      return
    }

    const cleanHeroImage = parseImageUrl(heroImage) || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600'
    const cleanGallery = galleryImages.map(img => parseImageUrl(img)).filter(img => img.length > 0)
    const cleanFeatures = features.map(f => f.trim()).filter(f => f.length > 0)

    const slug = editingService?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const serviceId = editingService?.id || slug

    const updatedServiceObj = {
      id: serviceId,
      slug: slug,
      title: title.trim(),
      category: category.trim(),
      shortDesc: shortDesc.trim(),
      fullDesc: fullDesc.trim() || shortDesc.trim(),
      heroImage: cleanHeroImage,
      img: cleanHeroImage,
      gallery: cleanGallery.length > 0 ? cleanGallery : [cleanHeroImage],
      features: cleanFeatures.length > 0 ? cleanFeatures : ['Luxury Event Setup'],
      process: editingService?.process || [
        { step: '01', title: 'Consultation & Concept', desc: 'Mapping client requirements and budget.' },
        { step: '02', title: 'Flawless Execution', desc: 'Professional on-site coordination and VIP service.' }
      ],
      faqs: editingService?.faqs || [
        { q: 'How early should we book this service package?', a: 'We recommend booking 2 to 6 months in advance for peak wedding and festival seasons.' }
      ]
    }

    let updatedList = []
    if (editingService) {
      updatedList = services.map(s => (s.id === editingService.id || s.slug === editingService.slug) ? updatedServiceObj : s)
    } else {
      updatedList = [updatedServiceObj, ...services]
    }

    await saveServicesToDb(updatedList)
  }

  // Delete Service Handler
  const handleDeleteService = async (svcId) => {
    if (!window.confirm('Are you sure you want to delete this service package?')) return
    const updatedList = services.filter(s => s.id !== svcId && s.slug !== svcId)
    await saveServicesToDb(updatedList)
  }

  const inputClasses = "w-full bg-luxury-black border border-gold/25 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all"
  const labelClasses = "text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1"

  return (
    <div className="space-y-8 font-poppins text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="text-gold" size={28} /> Services & Packages Manager
          </h1>
          <p className="text-luxury-muted text-xs mt-1">
            Add, edit, or customize signature service packages, hero images, and gallery photo links.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gold-gradient text-luxury-black font-bold uppercase tracking-widest text-xs px-5 py-3 rounded-sm shadow-gold-glow hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* Alert Banner */}
      {error && (
        <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 p-4 rounded text-red-400 text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 border border-gold/30 bg-gold/10 p-4 rounded text-gold text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border border-gold/25 border-t-gold animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <p className="py-8 text-luxury-muted text-xs text-center">No service packages found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id || svc.slug}
              className="glass-card rounded-xl overflow-hidden border border-gold/20 flex flex-col justify-between hover:border-gold/50 transition-all duration-300 shadow-xl"
            >
              {/* Image Preview Banner */}
              <div className="aspect-video relative bg-black overflow-hidden border-b border-gold/10">
                <img
                  src={parseImageUrl(svc.heroImage || svc.img)}
                  alt={svc.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
                  }}
                />
                <span className="absolute top-2.5 right-2.5 bg-black/80 border border-gold/30 px-2.5 py-0.5 rounded text-gold text-[9px] font-bold uppercase tracking-wider">
                  {svc.category || 'Service'}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-playfair text-lg font-bold text-white uppercase tracking-wider">
                    {svc.title}
                  </h3>
                  <p className="text-luxury-muted text-xs leading-relaxed line-clamp-2 font-light">
                    {svc.shortDesc}
                  </p>
                </div>

                {/* CRUD Controls */}
                <div className="pt-3 border-t border-gold/10 flex items-center justify-between">
                  <span className="text-[10px] text-gold/80 font-mono">
                    {svc.gallery ? `${svc.gallery.length} Photos` : '1 Photo'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(svc)}
                      className="px-3 py-1.5 border border-gold/40 text-gold hover:bg-gold hover:text-luxury-black rounded text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(svc.id || svc.slug)}
                      className="px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT / ADD SERVICE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-2xl rounded-xl border border-gold/30 p-6 sm:p-8 relative my-8 shadow-2xl">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-luxury-muted hover:text-gold transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-playfair text-xl font-bold uppercase tracking-wider text-white border-b border-gold/15 pb-4 mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-gold" />
              {editingService ? 'Edit Service Package' : 'Add New Service Package'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Service Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Royal Beachside Weddings"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Category Tag</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-luxury-black border border-gold/25 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition-all cursor-pointer"
                  >
                    {['Signature Events', 'Entertainment', 'Design & Decor', 'VIP Operations'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Brief summary for service cards..."
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Full Description</label>
                <textarea
                  rows={3}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Detailed description for individual service page..."
                  className={inputClasses}
                />
              </div>

              {/* Hero Image Link (Auto-Corrects Google Drive, Unsplash, Dropbox, etc.) */}
              <div>
                <label className={labelClasses}>Hero Banner Image URL * (Paste any image link)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold/60 pointer-events-none">
                    <LinkIcon size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or Google Drive link"
                    className="w-full bg-luxury-black border border-gold/25 rounded pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition-all"
                  />
                </div>
                <p className="text-[10px] text-luxury-muted mt-1">
                  Supports direct URLs, Unsplash, Pexels, Google Drive share links, Dropbox, etc.
                </p>
              </div>

              {/* Gallery Image URLs Array */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={labelClasses}>Service Gallery Photo Links</label>
                  <button
                    type="button"
                    onClick={() => setGalleryImages([...galleryImages, ''])}
                    className="text-[10px] text-gold font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12} /> Add Photo URL
                  </button>
                </div>

                <div className="space-y-2">
                  {galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => {
                          const copy = [...galleryImages]
                          copy[idx] = e.target.value
                          setGalleryImages(copy)
                        }}
                        placeholder={`Photo ${idx + 1} URL...`}
                        className={inputClasses}
                      />
                      {galleryImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                          className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-gold/15 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-widest font-semibold text-luxury-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gold-gradient text-luxury-black font-bold uppercase tracking-widest text-xs px-6 py-2 rounded shadow-gold-glow disabled:opacity-50 transition-all flex items-center justify-center min-w-[110px]"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : 'Save Service'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
