/**
 * Notification Service for AP Events
 * Handles Email and Automated Background WhatsApp notifications sent directly to Admin on client form submission.
 */

// Configurable Admin Details
export const ADMIN_WHATSAPP_NUMBER = import.meta.env.VITE_ADMIN_WHATSAPP || '919150226356' // +91 91502 26356
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'info@apevents.com'

/**
 * Formats and generates a WhatsApp Click-to-Chat URL for Admin notification
 */
export function generateAdminWhatsAppUrl({ name, phone, email, eventType, eventDate, message, recipientNumber = ADMIN_WHATSAPP_NUMBER }) {
  const cleanRecipient = recipientNumber.replace(/\D/g, '')
  
  const textMessage = `🚨 *NEW EVENT LEAD SUBMITTED | AP EVENTS ADMIN* 🚨
----------------------------------
👤 *Client Name:* ${name || 'N/A'}
📞 *Client Phone:* ${phone || 'N/A'}
✉️ *Client Email:* ${email || 'N/A'}
🎉 *Event Category:* ${eventType || 'General Event Inquiry'}
📅 *Requested Date:* ${eventDate || 'To be decided'}
📝 *Special Notes:* ${message || 'No additional details provided.'}
----------------------------------
📌 *Action:* Please review & contact client within 2 hours.`

  return `https://wa.me/${cleanRecipient}?text=${encodeURIComponent(textMessage)}`
}

/**
 * Generates WhatsApp quick reply URL for Admin to reply to a client
 */
export function generateAdminReplyWhatsAppUrl({ clientName, clientPhone, eventType }) {
  const cleanPhone = clientPhone.replace(/\D/g, '')
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone

  const replyText = `Hello ${clientName}, thank you for contacting *AP Events* regarding your upcoming *${eventType}*! Our senior event planner is ready to assist you. How can we help bring your dream event to life?`

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(replyText)}`
}

/**
 * Sends Email Notification to Admin via Web3Forms (optional)
 */
export async function sendAdminEmailNotification({ name, phone, email, eventType, eventDate, message, apiKey = '' }) {
  try {
    const accessKey = apiKey || import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

    // If Web3Forms key is not configured, skip email fetch silently without error
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY') {
      return { success: false, message: 'Web3Forms key not configured. Skipped email fetch.' }
    }

    const payload = {
      access_key: accessKey,
      subject: `🚨 NEW LEAD: ${name} requested ${eventType}`,
      from_name: 'AP Events Notification Desk',
      to_email: ADMIN_EMAIL,
      replyto: email || 'no-reply@apevents.com',
      client_name: name,
      client_phone: phone,
      client_email: email || 'Not Provided',
      event_type: eventType,
      event_date: eventDate || 'Unspecified',
      notes: message || 'N/A',
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
    console.warn('Admin Email notification error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Sends Automated Background WhatsApp Notification directly to Admin's WhatsApp phone
 */
export async function sendAdminWhatsAppNotification({ name, phone, email, eventType, eventDate, message }) {
  const waUrl = generateAdminWhatsAppUrl({ name, phone, email, eventType, eventDate, message })

  // 1. CallMeBot Free WhatsApp Push Gateway
  const callmebotApiKey = import.meta.env.VITE_CALLMEBOT_APIKEY
  const targetPhone = ADMIN_WHATSAPP_NUMBER.replace(/\D/g, '')

  if (callmebotApiKey) {
    try {
      const alertMsg = `🚨 *NEW WEBSITE INQUIRY RECEIVED* 🚨\nName: ${name}\nPhone: ${phone}\nEvent: ${eventType}\nDate: ${eventDate || 'TBD'}\nNotes: ${message || 'N/A'}`
      const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=+${targetPhone}&text=${encodeURIComponent(alertMsg)}&apikey=${callmebotApiKey}`
      
      // Fire callmebot request in background
      fetch(callmebotUrl, { mode: 'no-cors' }).catch(e => console.warn('CallMeBot fetch background warning:', e))
    } catch (err) {
      console.warn('CallMeBot automated WhatsApp notify error:', err)
    }
  }

  // 2. Custom Webhook WhatsApp Gateway (UltraMsg / Twilio / Meta API)
  const gatewayUrl = import.meta.env.VITE_WHATSAPP_GATEWAY_URL
  const gatewayToken = import.meta.env.VITE_WHATSAPP_GATEWAY_TOKEN

  if (gatewayUrl && gatewayToken) {
    try {
      await fetch(gatewayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: gatewayToken,
          to: targetPhone,
          body: `New Website Inquiry Alert: ${name} (${phone}) requested ${eventType} on ${eventDate || 'TBD'}`
        })
      })
    } catch (err) {
      console.warn('WhatsApp gateway webhook error:', err)
    }
  }

  return waUrl
}

/**
 * Combined Master Function: Triggers both Email & Automated Background WhatsApp notifications to Admin
 */
export async function notifyAdminOnInquiry({ name, phone, email, eventType, eventDate, message, autoOpenWhatsApp = true }) {
  // 1. Dispatch Admin Email Notification
  const emailPromise = sendAdminEmailNotification({ name, phone, email, eventType, eventDate, message })

  // 2. Dispatch Automated Background WhatsApp Notification
  const waUrl = await sendAdminWhatsAppNotification({ name, phone, email, eventType, eventDate, message })

  // 3. Open WhatsApp to notify Admin directly if autoOpen is active
  if (autoOpenWhatsApp && typeof window !== 'undefined') {
    try {
      window.open(waUrl, '_blank')
    } catch (e) {
      console.warn('Popup blocked for WhatsApp auto-open:', e)
    }
  }

  const emailResult = await emailPromise
  return { waUrl, emailResult }
}
