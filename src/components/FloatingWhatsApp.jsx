import React, { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function FloatingWhatsApp() {
  const [phone, setPhone] = useState('919876543210')
  const [message, setMessage] = useState('Hello, I would like to know more about your event services.')

  useEffect(() => {
    const fetchWhatsAppNumber = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'contact_info')
          .single()
        
        if (data && data.value && data.value.whatsapp) {
          // Strip non-numbers from whatsapp config
          const cleaned = data.value.whatsapp.replace(/\D/g, '')
          setPhone(cleaned)
        }
      } catch (err) {
        console.error('Failed to load WhatsApp number:', err)
      }
    }
    fetchWhatsAppNumber()
  }, [])

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-luxury-black border-2 border-gold text-gold shadow-gold-glow-lg hover:bg-gold hover:text-luxury-black hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Contact AP Events on WhatsApp"
    >
      {/* Pulse Outer Rings */}
      <span className="absolute inset-0 rounded-full border border-gold opacity-75 animate-ping pointer-events-none group-hover:hidden" />
      
      {/* Premium Message Icon resembling WhatsApp */}
      <MessageSquare className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
      
      {/* Tooltip */}
      <span className="absolute right-16 bg-luxury-black/90 text-gold text-xs uppercase tracking-widest px-3 py-1.5 rounded border border-gold/25 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md">
        Inquire on WhatsApp
      </span>
    </a>
  )
}
