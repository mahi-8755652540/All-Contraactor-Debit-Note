import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IndianRupee, Clock, CheckCircle, ArrowUpRight, Loader2, LayoutDashboard } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDeduction: 0,
    pending: 0,
    approved: 0,
    applied: 0,
  })
  const [recentNotes, setRecentNotes] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Fetch all debit notes with contractor info
      const { data: notes } = await supabase
        .from("debit_notes")
        .select("*, contractors(company)")
        .order("created_at", { ascending: false })

      if (notes) {
        // Stats
        const totalDeduction = notes.reduce((sum: number, n: any) => sum + Number(n.total_amount || 0), 0)
        const pending = notes.filter((n: any) => n.status === "Pending").length
        const approved = notes.filter((n: any) => n.status === "Approved").length
        const applied = notes.filter((n: any) => n.status === "Applied").length
        setStats({ totalDeduction, pending, approved, applied })

        // Recent 5 notes
        setRecentNotes(notes.slice(0, 5).map((n: any) => ({
          ...n,
          contractor_name: n.contractors?.company || "—",
        })))

        // Monthly summary — group by month
        const monthMap: Record<string, number> = {}
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
        notes.forEach((n: any) => {
          const month = monthNames[new Date(n.created_at).getMonth()]
          monthMap[month] = (monthMap[month] || 0) + Number(n.total_amount || 0)
        })
        
        const monthly = monthNames
          .filter(m => monthMap[m])
          .map(m => ({ name: m, amount: monthMap[m] }))
        
        // Ensure at least 3 months show for better chart UI even if empty
        if (monthly.length === 1) {
            const mIndex = monthNames.indexOf(monthly[0].name);
            if (mIndex > 0) monthly.unshift({ name: monthNames[mIndex-1], amount: 0 });
            if (mIndex < 11) monthly.push({ name: monthNames[mIndex+1], amount: 0 });
        } else if (monthly.length === 0) {
            const currentMonth = new Date().getMonth();
            monthly.push({ name: monthNames[currentMonth === 0 ? 11 : currentMonth - 1], amount: 0 });
            monthly.push({ name: monthNames[currentMonth], amount: 0 });
            monthly.push({ name: monthNames[currentMonth === 11 ? 0 : currentMonth + 1], amount: 0 });
        }

        setMonthlyData(monthly)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const getStatusVariant = (status: string) => {
    if (status === "Approved") return "default"
    if (status === "Applied") return "secondary"
    return "outline"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="text-muted-foreground text-lg font-medium">Loading dashboard data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Dashboard Overview
            </h2>
            <p className="text-muted-foreground mt-1">Here's what's happening with your debit notes today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-soft overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Deduction</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-slate-900">₹{stats.totalDeduction.toLocaleString("en-IN")}</div>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Across all time</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Pending Review</CardTitle>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-slate-900">{stats.pending}</div>
            <p className="text-sm text-amber-600 mt-1 font-medium">Require immediate action</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Approved Notes</CardTitle>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-slate-900">{stats.approved}</div>
            <p className="text-sm text-emerald-600 mt-1 font-medium">Ready for payout</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Applied to Payout</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-slate-900">{stats.applied}</div>
            <p className="text-sm text-purple-600 mt-1 font-medium">Successfully deducted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Bar Chart */}
        <Card className="col-span-4 border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="font-heading">Monthly Deduction Summary</CardTitle>
            <CardDescription>Total deductions processed over recent months</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 pr-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 0, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={13} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={13} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`} 
                    dx={-10}
                  />
                  <Tooltip 
                    cursor={{ fill: "rgba(226, 232, 240, 0.4)" }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)' }}
                    formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Amount"]} 
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="url(#colorAmount)" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={60}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3 border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="font-heading">Recent Activity</CardTitle>
            <CardDescription>Latest debit notes created in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-slate-50 rounded-lg border border-dashed">
                <LayoutDashboard className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">No debit notes yet.</p>
                <p className="text-sm text-slate-400 mt-1">Create your first debit note to see activity here!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentNotes.map((note) => (
                  <div key={note.id} className="flex items-center group p-3 -mx-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {note.contractor_name.charAt(0)}
                    </div>
                    <div className="space-y-1 ml-4 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{note.dn_number}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{note.contractor_name}</p>
                    </div>
                    <div className="ml-auto text-right shrink-0">
                      <div className="font-bold text-slate-900">₹{Number(note.total_amount).toLocaleString("en-IN")}</div>
                      <Badge variant={getStatusVariant(note.status)} className="mt-1.5 text-[10px] px-2 py-0 h-5">
                        {note.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
