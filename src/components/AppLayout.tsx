import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, FileText, Users, Building, Settings, Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Debit Notes", href: "/debit-notes", icon: FileText },
    { name: "Contractors", href: "/contractors", icon: Users },
    { name: "Projects", href: "/projects", icon: Building },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-xl font-bold text-primary tracking-tight">Shree Spaace</span>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 md:hidden" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">Admin User</div>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
