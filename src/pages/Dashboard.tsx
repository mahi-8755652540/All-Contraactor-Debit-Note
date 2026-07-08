import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee, Clock, CheckCircle, ArrowUpRight, Loader2 } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
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
        setMonthlyData(monthly.length > 0 ? monthly : [{ name: "No Data", amount: 0 }])
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground text-lg">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deduction</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalDeduction.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all debit notes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Notes</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Ready for payout deduction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied to Payout</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applied}</div>
            <p className="text-xs text-muted-foreground">Successfully deducted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Bar Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Deduction Summary</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip cursor={{ fill: "transparent" }} formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Amount"]} />
                  <Bar dataKey="amount" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No debit notes yet.</p>
                <p className="text-sm mt-1">Create your first debit note!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentNotes.map((note) => (
                  <div key={note.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{note.dn_number}</p>
                      <p className="text-sm text-muted-foreground">{note.contractor_name}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="font-medium">₹{Number(note.total_amount).toLocaleString()}</div>
                      <Badge variant={getStatusVariant(note.status)} className="mt-1 text-xs">
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
