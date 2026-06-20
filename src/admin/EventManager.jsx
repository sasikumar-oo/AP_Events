import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Globe, EyeOff, Calendar, MapPin, Check, AlertCircle, X } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function EventManager() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form modal triggers
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('Weddings')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [published, setPublished] = useState(true)

  // Status
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })
      if (error) throw error
      if (data) setEvents(data)
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError('Could not fetch events catalog.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (val) => {
    setTitle(val)
    if (!editingEvent) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .replace(/\s+/g, '-')          // replace spaces with hyphens
        .replace(/-+/g, '-')           // collapse double hyphens
        .trim()
      setSlug(generated)
    }
  }

  const openAddForm = () => {
    setEditingEvent(null)
    setTitle('')
    setSlug('')
    setCategory('Weddings')
    setDescription('')
    setDate('')
    setLocation('')
    setImageUrl('')
    setPublished(true)
    setError('')
    setFormOpen(true)
  }

  const openEditForm = (evt) => {
    setEditingEvent(evt)
    setTitle(evt.title)
    setSlug(evt.slug)
    setCategory(evt.category)
    setDescription(evt.description || '')
    setDate(evt.date)
    setLocation(evt.location)
    setImageUrl(evt.image_url || '')
    setPublished(evt.published)
    setError('')
    setFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this event from public archives?')) return
    try {
      const { error: delErr } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      if (delErr) throw delErr
      setSuccess('Event deleted successfully.')
      fetchEvents()
    } catch (err) {
      console.error('Delete event error:', err)
      setError('Could not delete event.')
    }
  }

  const handleTogglePublish = async (evt) => {
    const updatedStatus = !evt.published
    try {
      const { error: updErr } = await supabase
        .from('events')
        .update({ published: updatedStatus })
        .eq('id', evt.id)
      
      if (updErr) throw updErr
      setSuccess(`Event is now ${updatedStatus ? 'published' : 'unpublished'}.`)
      fetchEvents()
    } catch (err) {
      console.error('Toggle status error:', err)
      setError('Could not update status.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      description: description.trim(),
      date,
      location: location.trim(),
      image_url: imageUrl.trim() || null,
      published
    }

    try {
      if (editingEvent) {
        const { error: updErr } = await supabase
          .from('events')
          .update(payload)
          .eq('id', editingEvent.id)
        if (updErr) throw updErr
        setSuccess('Event updated successfully.')
      } else {
        const { error: insErr } = await supabase
          .from('events')
          .insert([payload])
        if (insErr) throw insErr
        setSuccess('New event published successfully.')
      }
      setFormOpen(false)
      fetchEvents()
    } catch (err) {
      console.error('Save event error:', err)
      setError(err.message || 'An error occurred while saving.')
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
            Events Manager
          </h1>
          <p className="text-luxury-muted text-xs font-poppins mt-1">
            Write, review, publish, and delete events showcased across public routes.
          </p>
        </div>
        
        <button
          onClick={openAddForm}
          className="bg-gold-gradient text-luxury-black font-semibold uppercase tracking-widest text-xs px-5 py-3 rounded-sm shadow-gold-glow hover:scale-105 transition-all flex items-center gap-1.5"
        >
          <Plus size={16} /> Create Event
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

      {/* Events Table / List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border border-gold/25 border-t-gold animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-center py-10 text-luxury-muted text-xs font-poppins">No events currently configured. Click "Create Event" to start.</p>
      ) : (
        <div className="overflow-x-auto glass-card rounded-sm border border-gold/15">
          <table className="w-full text-left border-collapse text-xs font-poppins">
            <thead>
              <tr className="border-b border-gold/20 text-gold uppercase tracking-wider bg-luxury-black/45">
                <th className="p-4 font-semibold">Cover</th>
                <th className="p-4 font-semibold">Event Details</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-white/80">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-luxury-card/30 transition-colors">
                  <td className="p-4">
                    <img
                      src={evt.image_url || 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=100'}
                      alt={evt.title}
                      className="w-14 h-10 object-cover rounded-sm border border-gold/20"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white text-sm line-clamp-1">{evt.title}</div>
                    <div className="text-luxury-muted mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar size={12} className="text-gold" /> {evt.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-gold" /> {evt.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="border border-gold/10 px-2 py-0.5 bg-luxury-black/35 rounded-sm uppercase tracking-wider text-[9px]">
                      {evt.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(evt)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] uppercase tracking-wider font-semibold border ${
                        evt.published
                          ? 'border-green-500/30 bg-green-500/10 text-green-400'
                          : 'border-white/10 bg-luxury-black text-luxury-muted'
                      }`}
                    >
                      {evt.published ? (
                        <>
                          <Globe size={10} /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff size={10} /> Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditForm(evt)}
                      className="p-2 border border-gold/20 hover:border-gold hover:bg-gold/10 text-gold rounded-sm transition-all"
                      title="Edit details"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="p-2 border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-red-400 rounded-sm transition-all"
                      title="Delete event"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CRUD MODAL OVERLAY */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-2xl rounded-sm border border-gold/25 p-8 relative max-h-[90vh] overflow-y-auto my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 text-luxury-muted hover:text-gold transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-playfair text-xl font-bold uppercase tracking-wider text-white border-b border-gold/15 pb-4 mb-6">
              {editingEvent ? 'Modify Showcase Event' : 'Create Showcase Event'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Traditional Royal Melam Conclave"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">URL Slug (SEO friendly) *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. traditional-royal-melam-conclave"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-luxury-black border border-gold/25 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all appearance-none cursor-pointer"
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
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">Cover Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/photo-12345"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">Execution Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bolgatty Palace, Kochi"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1.5">Description / Article Text *</label>
                <textarea
                  required
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the detailed writeup for this event..."
                  className={inputClasses}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheckbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-gold/20 text-gold bg-luxury-black focus:ring-transparent accent-gold"
                />
                <label htmlFor="publishedCheckbox" className="text-xs text-white select-none">
                  Publish immediately (Visible in public events feed)
                </label>
              </div>

              <div className="pt-4 border-t border-gold/15 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-luxury-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gold-gradient text-luxury-black font-semibold uppercase tracking-widest text-xs px-6 py-2.5 rounded-sm shadow-gold-glow disabled:opacity-50 transition-all flex items-center justify-center min-w-[100px]"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}
