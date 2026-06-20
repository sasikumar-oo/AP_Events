import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Shared UI components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'

// Admin Pages
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import EventManager from './admin/EventManager'
import GalleryManager from './admin/GalleryManager'
import ContentManager from './admin/ContentManager'
import EnquiryManager from './admin/EnquiryManager'

// Public layout wrapper separating public headers from administrative workspaces
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Content offset for fixed navbar */}
      <div className="flex-grow pt-[73px] md:pt-[85px]">
        <Outlet />
      </div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Secure Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<EventManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="enquiries" element={<EnquiryManager />} />
          </Route>

          {/* Catch-all fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-luxury-bg text-center px-6">
                <h1 className="text-5xl font-playfair text-gold font-bold mb-4">404</h1>
                <p className="text-luxury-muted text-sm mb-6 uppercase tracking-wider">Page Not Found</p>
                <a href="/" className="btn-gold-outline px-6 py-2 rounded-sm text-xs font-semibold uppercase tracking-widest">
                  Back To Home
                </a>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
