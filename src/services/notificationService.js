/**
 * Notification Service for AP Events
 * Handles Email and WhatsApp notifications for client inquiries and bookings.
 */

// AP Events Concierge WhatsApp Hotline Number
export const AP_EVENTS_WHATSAPP_NUMBER = '919150226356' // +91 91502 26356

/**
 * Formats and generates a WhatsApp Click-to-Chat URL for an inquiry
 */
export function generateWhatsAppUrl({ name, phone, email, eventType, eventDate, message, recipientNumber = AP_EVENTS_WHATSAPP_NUMBER }) {
  const cleanRecipient = recipientNumber.replace(/\D/g, '')
  
  const textMessage = `✨ *NEW EVENT INQUIRY | AP EVENTS* ✨
----------------------------------
👤 *Name:* ${name || 'N/A'}
📞 *Phone:* ${phone || 'N/A'}
✉️ *Email:* ${email || 'N/A'}
🎉 *Service:* ${eventType || 'General Event Inquiry'}
📅 *Target Date:* ${eventDate || 'To be decided'}
📝 *Message/Notes:* ${message || 'No additional details provided.'}
----------------------------------
Sent via AP Events Digital Portal`

  return `https://wa.me/${cleanRecipient}?text=${encodeURIComponent(textMessage)}`
}

/**
 * Generates WhatsApp quick reply URL for Admin to reply to a client
 */
export function generateAdminReplyWhatsAppUrl({ clientName, clientPhone, eventType }) {
  const cleanPhone = clientPhone.replace(/\D/g, '')
  // If no country code, default to India +91
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone

  const replyText = `Hello ${clientName}, thank you for contacting *AP Events* regarding your upcoming *${eventType}*! Our senior event planner is ready to assist you. How can we help bring your dream event to life?`

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(replyText)}`
}

/**
 * Sends Email notification via Web3Forms / REST Email Service
 */
export async function sendEmailNotification({ name, phone, email, eventType, eventDate, message, apiKey = '' }) {
  try {
    // If Web3Forms access key is configured or fallback public endpoint
    const accessKey = apiKey || import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY'

    const payload = {
      access_key: accessKey,
      subject: `🎉 New Event Lead: ${name} - ${eventType}`,
      from_name: 'AP Events Inquiry System',
      replyto: email || 'no-reply@apevents.com',
      name,
      phone,
      email: email || 'Not Provided',
      event_type: eventType,
      event_date: eventDate || 'Unspecified',
      message: message || 'N/A',
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    return { success: data.success, message: data.message }
  } catch (error) {
    console.warn('Email notification error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Direct mailto trigger fallback
 */
export function generateMailtoUrl({ name, phone, email, eventType, eventDate, message, adminEmail = 'info@apevents.com' }) {
  const subject = `Inquiry for ${eventType} - ${name}`
  const body = `Name: ${name}
Phone: ${phone}
Email: ${email || 'N/A'}
Event Type: ${eventType}
Target Date: ${eventDate || 'N/A'}
Message: ${message || 'N/A'}`

  return `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
