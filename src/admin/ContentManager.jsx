import React, { useState, useEffect } from 'react'
import { Settings, Sparkles, Phone, Compass, Plus, Trash2, Check, AlertCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function ContentManager() {
  const [activeTab, setActiveTab] = useState('hero') // 'hero', 'about', 'contact', 'testimonials'

  // Alerts
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  // 1. Hero Form State
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    bg_image: '',
    cta_text: '',
    whatsapp_text: ''
  })

  // 2. About Form State
  const [about, setAbout] = useState({
    title: '',
    description: '',
    vision: '',
    mission: '',
    points: []
  })
  const [newPoint, setNewPoint] = useState('')

  // 3. Contact Form State
  const [contact, setContact] = useState({
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    google_map_url: ''
  })

  // 4. Testimonials State
  const [testimonials, setTestimonials] = useState([])
  const [tName, setTName] = useState('')
  const [tReview, setTReview] = useState('')
  const [tRating, setTRating] = useState(5)

  useEffect(() => {
    fetchSettings()
    fetchTestimonials()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('site_settings').select('*')
      if (data) {
        data.forEach(item => {
          if (item.key === 'hero_banner') setHero(item.value)
          if (item.key === 'about_content') setAbout(item.value)
          if (item.key === 'contact_info') setContact(item.value)
        })
      }
    } catch (err) {
      console.error('Failed to load site configurations:', err)
      setError('Could not query site settings.')
    }
  }

  const fetchTestimonials = async () => {
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setTestimonials(data)
    } catch (err) {
      console.error('Failed to load testimonials:', err)
    }
  }

  // Save Settings wrapper
  const saveSettings = async (key, value) => {
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      const { error: updErr } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date() })

      if (updErr) throw updErr
      setSuccess('Settings updated successfully!')
      fetchSettings()
    } catch (err) {
      console.error('Upsert settings failed:', err)
      setError('Failed to update settings.')
    } finally {
      setSaving(false)
    }
  }

  // Points helpers for About
  const addAboutPoint = () => {
    if (!newPoint.trim()) return
    setAbout(prev => ({
      ...prev,
      points: [...(prev.points || []), newPoint.trim()]
    }))
    setNewPoint('')
  }

  const removeAboutPoint = (idx) => {
    setAbout(prev => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== idx)
    }))
  }

  // Testimonial helpers
  const handleAddTestimonial = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!tName.trim() || !tReview.trim()) return setError('Client name and review are required.')

    try {
      const { error: insErr } = await supabase
        .from('testimonials')
        .insert([{ client_name: tName.trim(), review: tReview.trim(), rating: tRating }])

      if (insErr) throw insErr
      setSuccess('Testimonial added.')
      setTName('')
      setTReview('')
      setTRating(5)
      fetchTestimonials()
    } catch (err) {
      console.error('Save testimonial failed:', err)
      setError('Could not save testimonial.')
    }
  }

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this client testimonial permanently?')) return
    try {
      const { error: delErr } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)
      if (delErr) throw delErr
      setSuccess('Testimonial removed.')
      fetchTestimonials()
    } catch (err) {
      console.error('Delete review failed:', err)
      setError('Could not delete review.')
    }
  }

  const inputClasses = "w-full bg-luxury-black border border-gold/25 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition-all"
  const labelClasses = "text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5"

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="border-b border-gold/15 pb-6">
        <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">
          Content Settings
        </h1>
        <p className="text-luxury-muted text-xs font-poppins mt-1">
          Adjust landing headlines, vision statements, contact points, and customer feedback.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-gold/10 pb-4">
        {[
          { id: 'hero', label: 'Hero Banner', icon: <Sparkles size={14} /> },
          { id: 'about', label: 'About Details', icon: <Compass size={14} /> },
          { id: 'contact', label: 'Contact Coordinates', icon: <Phone size={14} /> },
          { id: 'testimonials', label: 'Reviews Logs', icon: <Settings size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setError('')
              setSuccess('')
            }}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold border rounded-sm transition-all duration-300 flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-gold text-luxury-black border-gold shadow-gold-glow'
                : 'border-gold/20 text-white/80 hover:border-gold hover:text-gold'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 p-4 rounded-sm text-red-400 text-xs font-poppins">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 border border-gold/30 bg-gold/10 p-4 rounded-sm text-gold text-xs font-poppins">
          <Check size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* active view contents */}
      <div className="glass-card p-8 rounded-sm border border-gold/15">
        
        {/* 1. HERO TAB */}
        {activeTab === 'hero' && (
          <form onSubmit={(e) => { e.preventDefault(); saveSettings('hero_banner', hero); }} className="space-y-5 font-poppins">
            <h3 className="font-playfair text-lg font-bold uppercase tracking-wider text-white border-b border-gold/10 pb-2 mb-4">Hero Content Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>Main Headline</label>
                <input
                  type="text"
                  value={hero.title || ''}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Background Image URL</label>
                <input
                  type="url"
                  value={hero.bg_image || ''}
                  onChange={(e) => setHero({ ...hero, bg_image: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Hero Subtitle Text</label>
              <textarea
                rows="3"
                value={hero.subtitle || ''}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>CTA Button Label</label>
                <input
                  type="text"
                  value={hero.cta_text || ''}
                  onChange={(e) => setHero({ ...hero, cta_text: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>WhatsApp Prefilled Msg</label>
                <input
                  type="text"
                  value={hero.whatsapp_text || ''}
                  onChange={(e) => setHero({ ...hero, whatsapp_text: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-gold/10 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-gold-gradient text-luxury-black font-semibold uppercase tracking-widest text-xs px-6 py-2.5 rounded-sm shadow-gold-glow disabled:opacity-50"
              >
                {saving ? 'Syncing...' : 'Save Hero Settings'}
              </button>
            </div>
          </form>
        )}

        {/* 2. ABOUT TAB */}
        {activeTab === 'about' && (
          <form onSubmit={(e) => { e.preventDefault(); saveSettings('about_content', about); }} className="space-y-5 font-poppins">
            <h3 className="font-playfair text-lg font-bold uppercase tracking-wider text-white border-b border-gold/10 pb-2 mb-4">About Section Settings</h3>
            <div>
              <label className={labelClasses}>Section Headline</label>
              <input
                type="text"
                value={about.title || ''}
                onChange={(e) => setAbout({ ...about, title: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Company Description Overview</label>
              <textarea
                rows="4"
                value={about.description || ''}
                onChange={(e) => setAbout({ ...about, description: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>Vision Statement</label>
                <textarea
                  rows="3"
                  value={about.vision || ''}
                  onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Mission Statement</label>
                <textarea
                  rows="3"
                  value={about.mission || ''}
                  onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            
            {/* Highlights bullet points editor */}
            <div className="space-y-3 pt-3 border-t border-gold/10">
              <label className={labelClasses}>Signature Highlights List</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  placeholder="Add custom showcase point..."
                  className="flex-grow bg-luxury-black border border-gold/25 rounded px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={addAboutPoint}
                  className="bg-gold text-luxury-black text-xs uppercase px-4 py-2 font-semibold rounded-sm hover:bg-gold-light"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2 mt-3">
                {about.points && about.points.map((pt, idx) => (
                  <li key={idx} className="flex justify-between items-center text-xs bg-luxury-black border border-gold/10 p-2.5 rounded-sm">
                    <span className="text-white/80">{pt}</span>
                    <button
                      type="button"
                      onClick={() => removeAboutPoint(idx)}
                      className="text-red-400 hover:text-red-500 font-semibold"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gold/10 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-gold-gradient text-luxury-black font-semibold uppercase tracking-widest text-xs px-6 py-2.5 rounded-sm shadow-gold-glow"
              >
                {saving ? 'Syncing...' : 'Save About Settings'}
              </button>
            </div>
          </form>
        )}

        {/* 3. CONTACT TAB */}
        {activeTab === 'contact' && (
          <form onSubmit={(e) => { e.preventDefault(); saveSettings('contact_info', contact); }} className="space-y-5 font-poppins">
            <h3 className="font-playfair text-lg font-bold uppercase tracking-wider text-white border-b border-gold/10 pb-2 mb-4">Contact Information Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>Primary Phone Number</label>
                <input
                  type="text"
                  value={contact.phone || ''}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>General Enquiry Email</label>
                <input
                  type="email"
                  value={contact.email || ''}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Physical Address</label>
              <input
                type="text"
                value={contact.address || ''}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className={labelClasses}>WhatsApp Number (Digits only)</label>
                <input
                  type="text"
                  value={contact.whatsapp || ''}
                  onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                  placeholder="e.g. 919876543210"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Instagram Handler</label>
                <input
                  type="text"
                  value={contact.instagram || ''}
                  onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                  placeholder="e.g. @ap_events_luxury"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Facebook Handler</label>
                <input
                  type="text"
                  value={contact.facebook || ''}
                  onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
                  placeholder="e.g. ap.events.luxury"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Google Map Embed URL</label>
                <input
                  type="text"
                  value={contact.google_map_url || ''}
                  onChange={(e) => setContact({ ...contact, google_map_url: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-gold/10 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-gold-gradient text-luxury-black font-semibold uppercase tracking-widest text-xs px-6 py-2.5 rounded-sm shadow-gold-glow"
              >
                {saving ? 'Syncing...' : 'Save Contacts'}
              </button>
            </div>
          </form>
        )}

        {/* 4. TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8 font-poppins">
            
            {/* Create Testimonial Form */}
            <form onSubmit={handleAddTestimonial} className="space-y-4 bg-luxury-black border border-gold/10 p-6 rounded-sm">
              <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-gold">Log New Client Testimonial</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Client Name</label>
                  <input
                    type="text"
                    required
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    placeholder="e.g. Rohan & Preeti"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Rating Scale</label>
                  <select
                    value={tRating}
                    onChange={(e) => setTRating(parseInt(e.target.value))}
                    className="w-full bg-luxury-black border border-gold/25 rounded px-3 py-2 text-xs text-white"
                  >
                    {[5, 4, 3, 2, 1].map(r => (
                      <option key={r} value={r}>{r} Stars</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Client Review Message</label>
                <textarea
                  required
                  rows="2"
                  value={tReview}
                  onChange={(e) => setTReview(e.target.value)}
                  placeholder="Candid review comments..."
                  className={inputClasses}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gold text-luxury-black font-semibold uppercase tracking-widest text-[10px] px-5 py-2.5 rounded-sm shadow-gold-glow hover:bg-gold-light"
                >
                  Publish Review
                </button>
              </div>
            </form>

            {/* Testimonials List */}
            <div className="space-y-4">
              <h4 className="font-playfair text-base font-bold uppercase tracking-wider text-white border-b border-gold/10 pb-2">Active Reviews Database</h4>
              
              {testimonials.length === 0 ? (
                <p className="text-center py-6 text-luxury-muted text-xs">No client reviews logged.</p>
              ) : (
                <div className="divide-y divide-gold/10">
                  {testimonials.map(item => (
                    <div key={item.id} className="py-4 flex justify-between items-start gap-4">
                      <div>
                        <h5 className="font-semibold text-white text-xs uppercase">{item.client_name}</h5>
                        <p className="text-[10px] text-gold mt-0.5 font-semibold">{'★'.repeat(item.rating)}</p>
                        <p className="text-xs text-luxury-muted/95 italic mt-2">"{item.review}"</p>
                      </div>
                      <button
                        onClick={() => handleDeleteTestimonial(item.id)}
                        className="p-2 border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-red-400 rounded-sm"
                        title="Delete testimonial"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
