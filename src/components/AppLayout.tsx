import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, FileText, Users, Building, Settings, Menu, Bell, Search, LogOut } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Debit Notes", href: "/debit-notes", icon: FileText },
    { name: "Contractors", href: "/contractors", icon: Users },
    { name: "Projects", href: "/projects", icon: Building },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-24 items-center px-6 border-b border-slate-100 mb-2">
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="Shree Spaace Solution Logo" className="h-12 w-auto object-contain drop-shadow-sm" />
             <span className="text-xl font-heading font-extrabold text-slate-900 tracking-tight leading-none pt-1 flex flex-col gap-1">
                 Shree Spaace
                 <span className="text-primary text-xs font-bold tracking-widest uppercase">Solution</span>
             </span>
          </div>
        </div>
        <nav className="p-4 mt-4 space-y-1.5 px-4">
          <div className="px-4 pb-2 mb-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/25" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary"}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="absolute bottom-8 left-0 w-full px-6">
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between gap-2 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-sm">
                        {user?.email?.charAt(0).toUpperCase() || 'A'}
                      </span>
                  </div>
                  <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
                      <p className="text-xs text-slate-500 truncate" title={user?.email || ''}>{user?.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={signOut} className="text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0" title="Sign Out">
                  <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        {/* Header */}
        <header className="flex h-20 items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 lg:px-10 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-slate-100 text-slate-600" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Search Placeholder */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-sm transition-all">
                <Search className="h-4 w-4 text-slate-400 mr-2" />
                <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-700"
                />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-10 bg-[#FAFBFF]">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
