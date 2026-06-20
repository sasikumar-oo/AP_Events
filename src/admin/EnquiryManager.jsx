import React, { useState, useEffect } from 'react'
import { Search, Mail, Phone, Calendar, CheckSquare, Square, Trash2, Check, AlertCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function EnquiryManager() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterContacted, setFilterContacted] = useState('All') // 'All', 'Contacted', 'Pending'

  // Alerts
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      if (data) setEnquiries(data)
    } catch (err) {
      console.error('Failed to query enquiries:', err)
      setError('Could not query enquiries database table.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleContacted = async (enq) => {
    const updatedStatus = !enq.contacted
    try {
      const { error: updErr } = await supabase
        .from('enquiries')
        .update({ contacted: updatedStatus })
        .eq('id', enq.id)
      
      if (updErr) throw updErr
      setSuccess(`Enquiry marked as ${updatedStatus ? 'contacted' : 'pending'}.`)
      fetchEnquiries()
    } catch (err) {
      console.error('Enquiry toggle status error:', err)
      setError('Failed to update enquiry status.')
    }
  }

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this inquiry record from database permanently?')) return
    try {
      const { error: delErr } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id)
      if (delErr) throw delErr
      setSuccess('Enquiry deleted successfully.')
      fetchEnquiries()
    } catch (err) {
      console.error('Delete enquiry error:', err)
      setError('Could not delete enquiry record.')
    }
  }

  // Filter calculations
  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = 
      enq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      enq.phone.includes(searchTerm) || 
      enq.event_type.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesStatus = true
    if (filterContacted === 'Contacted') {
      matchesStatus = enq.contacted === true
    } else if (filterContacted === 'Pending') {
      matchesStatus = enq.contacted === false
    }

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="border-b border-gold/15 pb-6">
        <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">
          Client Inquiries
        </h1>
        <p className="text-luxury-muted text-xs font-poppins mt-1">
          Review consultation forms submitted by public visitors. Mark contacted items or search by client names.
        </p>
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

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-luxury-black/30 border border-gold/10 p-4 rounded-sm font-poppins">
        
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold/60 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, event type, or phone..."
            className="w-full bg-luxury-black border border-gold/25 rounded pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-luxury-muted/75 focus:outline-none focus:border-gold transition-all"
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-2 w-full md:w-auto justify-end">
          {['All', 'Pending', 'Contacted'].map(status => (
            <button
              key={status}
              onClick={() => setFilterContacted(status)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-semibold border rounded-sm transition-all duration-300 ${
                filterContacted === status
                  ? 'bg-gold text-luxury-black border-gold'
                  : 'border-gold/20 text-white/80 hover:border-gold hover:text-gold'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiry Logs */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border border-gold/25 border-t-gold animate-spin" />
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <p className="text-center py-10 text-luxury-muted text-xs font-poppins">No client inquiries match the specified filters.</p>
      ) : (
        <div className="space-y-6">
          {filteredEnquiries.map((enq) => (
            <div 
              key={enq.id} 
              className={`glass-card p-6 rounded-sm border transition-all duration-300 ${
                enq.contacted 
                  ? 'border-gold/10 opacity-70' 
                  : 'border-gold/30 shadow-[0_0_12px_rgba(212,175,55,0.05)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/10 pb-4 mb-4">
                
                {/* User Info Header */}
                <div>
                  <h3 className="text-base font-playfair font-bold text-white uppercase tracking-wider flex items-center gap-3">
                    {enq.name}
                    {!enq.contacted && (
                      <span className="border border-gold/30 bg-gold/10 text-[9px] uppercase px-2 py-0.5 rounded text-gold font-semibold tracking-wider font-poppins">New Inquiry</span>
                    )}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-luxury-muted mt-1 uppercase tracking-wider font-poppins font-medium">
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-gold" /> Submitted: {new Date(enq.created_at).toLocaleDateString()}</span>
                    {enq.event_date && (
                      <span className="flex items-center gap-1"><Calendar size={12} className="text-gold" /> Target Date: {new Date(enq.event_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                {/* Status and Delete Actions */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleToggleContacted(enq)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-sm text-[10px] uppercase tracking-wider font-semibold font-poppins transition-all ${
                      enq.contacted
                        ? 'border-green-500/20 bg-green-500/5 text-green-400'
                        : 'border-gold/40 hover:border-gold hover:bg-gold/10 text-gold'
                    }`}
                  >
                    {enq.contacted ? (
                      <>
                        <CheckSquare size={13} /> Contacted
                      </>
                    ) : (
                      <>
                        <Square size={13} /> Mark Contacted
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteEnquiry(enq.id)}
                    className="p-2 border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-red-400 rounded-sm transition-all"
                    title="Delete record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Inquiry Details Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-poppins">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gold font-semibold block mb-1">Target Service</span>
                    <span className="text-white text-sm font-semibold">{enq.event_type}</span>
                  </div>
                  {enq.message && (
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-luxury-muted block mb-1">Client Message</span>
                      <p className="text-white/80 leading-relaxed bg-luxury-black/30 border border-gold/5 p-3 rounded-sm italic font-light">
                        "{enq.message}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Direct action targets */}
                <div className="bg-luxury-black/45 border border-gold/10 p-4 rounded-sm flex flex-col justify-center space-y-3 font-semibold uppercase tracking-wider text-[10px]">
                  <span className="text-[9px] uppercase tracking-wider text-luxury-muted block mb-1">Connect Directly</span>
                  
                  <a
                    href={`tel:${enq.phone}`}
                    className="w-full border border-gold/30 hover:border-gold text-gold hover:text-white py-2.5 rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone size={12} /> Call {enq.phone}
                  </a>

                  <a
                    href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20this%20is%20AP%20Events%20regarding%20your%20inquiry...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gold text-luxury-black hover:bg-gold-light py-2.5 rounded-sm flex items-center justify-center gap-1.5 transition-colors text-center"
                  >
                    <Mail size={12} /> WhatsApp Chat
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
