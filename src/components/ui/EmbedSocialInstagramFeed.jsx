import React, { useEffect } from 'react'

export default function EmbedSocialInstagramFeed({ dataRef = "22ae802bbcf08a8b228929e0d7fef525da4c6f71" }) {
  useEffect(() => {
    // 1. Inject EmbedSocial Aggregator Script
    const scriptId = 'EmbedSocialHashtagScript'
    if (!document.getElementById(scriptId)) {
      const js = document.createElement('script')
      js.id = scriptId
      js.src = 'https://embedsocial.com/cdn/ht.js'
      js.async = true
      document.body.appendChild(js)
    }

    // 2. Inject CSS override to hide widget branding as shown in code snippet
    const styleId = 'EmbedSocialCustomStyle'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.innerHTML = `
        .es-widget-branding {
          display: none !important;
        }
        .es-footer-btn {
          background-color: #D4AF37 !important;
          color: #000000 !important;
          font-weight: bold !important;
          border-radius: 9999px !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [dataRef])

  return (
    <div className="w-full my-6 font-poppins">
      <div 
        className="embedsocial-hashtag" 
        data-ref={dataRef}
      >
        <a 
          className="feed-powered-by-es feed-powered-by-es-feed-img es-widget-branding" 
          href="https://embedsocial.com/social-media-aggregator/" 
          target="_blank" 
          rel="noopener noreferrer"
          title="Instagram widget"
        >
          <div className="es-widget-branding-text">Instagram widget</div>
        </a>
      </div>
    </div>
  )
}
