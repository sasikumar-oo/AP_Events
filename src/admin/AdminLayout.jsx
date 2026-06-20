import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, CalendarRange, Image, Settings, 
  MailOpen, LogOut, Menu, X, ShieldAlert 
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const menuItems = [
    { name: 'Dashboard Stats', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Events Manager', path: '/admin/dashboard/events', icon: <CalendarRange size={18} /> },
    { name: 'Gallery Portfolio', path: '/admin/dashboard/gallery', icon: <Image size={18} /> },
    { name: 'Page Content Settings', path: '/admin/dashboard/content', icon: <Settings size={18} /> },
    { name: 'Client Inquiries', path: '/admin/dashboard/enquiries', icon: <MailOpen size={18} /> }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-luxury-bg text-white font-poppins flex">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-luxury-black border-r border-gold/15 shrink-0 select-none">
        
        {/* Header Branding */}
        <div className="p-6 border-b border-gold/10 flex items-center gap-2">
          <ShieldAlert className="text-gold" size={22} />
          <span className="font-playfair text-lg font-bold tracking-widest text-gold uppercase">
            AP Admin Panel
          </span>
        </div>

        {/* User Badge */}
        <div className="px-6 py-4 bg-luxury-card/30 border-b border-gold/5 text-xs text-luxury-muted">
          Logged in: <span className="text-white block font-medium mt-0.5 line-clamp-1">{user?.email || 'Administrator'}</span>
        </div>

        {/* Menu Links */}
        <nav className="flex-grow p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm tracking-wide uppercase transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-gold text-luxury-black font-semibold shadow-gold-glow'
                  : 'text-white/80 hover:bg-luxury-card hover:text-gold'
              }`}
            >
              {item.icon}
              <span className="text-xs tracking-wider">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-gold/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-luxury-muted hover:text-red-400 hover:bg-red-500/10 rounded-sm text-sm uppercase tracking-wide transition-all duration-300"
          >
            <LogOut size={18} />
            <span className="text-xs tracking-wider font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION */}
      <div className="flex flex-col flex-grow min-h-screen overflow-x-hidden">
        
        {/* Mobile Navbar Row */}
        <header className="lg:hidden bg-luxury-black border-b border-gold/15 px-6 py-4 flex justify-between items-center relative z-40">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-gold" size={20} />
            <span className="font-playfair text-base font-bold tracking-widest text-gold">AP ADMIN</span>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white hover:text-gold transition-colors focus:outline-none"
            aria-label="Toggle admin sidebar"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed inset-0 top-[61px] w-full bg-luxury-black/95 z-30 lg:hidden border-t border-gold/10 transition-all duration-500 transform ${
            mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
        >
          <nav className="flex flex-col p-6 space-y-4">
            <div className="text-xs text-luxury-muted border-b border-gold/5 pb-2">
              Logged in: <span className="text-white font-medium">{user?.email}</span>
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-sm text-sm uppercase tracking-wider transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gold text-luxury-black font-semibold'
                    : 'text-white/80 hover:text-gold'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false)
                handleLogout()
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-luxury-muted hover:text-red-400 hover:bg-red-500/10 rounded-sm text-sm uppercase tracking-wider pt-6 border-t border-gold/10"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        {/* 3. MAIN ADMINISTRATIVE CONTENT AREA */}
        <main className="flex-grow p-6 md:p-10 relative z-10 bg-luxury-bg max-w-7xl w-full mx-auto">
          {/* Main workspace where active managers mount */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
