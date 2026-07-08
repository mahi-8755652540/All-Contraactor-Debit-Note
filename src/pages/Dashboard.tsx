import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee, Clock, CheckCircle, ArrowUpRight } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const monthlyData = [
  { name: "Jan", amount: 4000 },
  { name: "Feb", amount: 3000 },
  { name: "Mar", amount: 2000 },
  { name: "Apr", amount: 2780 },
  { name: "May", amount: 1890 },
  { name: "Jun", amount: 2390 },
  { name: "Jul", amount: 3490 },
]

const recentActivity = [
  { id: 1, dn: "DN-2026-001", contractor: "ABC Constructions", amount: 50000, status: "Pending", date: "Today" },
  { id: 2, dn: "DN-2026-002", contractor: "XYZ Builders", amount: 12000, status: "Approved", date: "Yesterday" },
  { id: 3, dn: "DN-2026-003", contractor: "Skyline Infra", amount: 35000, status: "Applied", date: "Jul 05" },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deduction</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,24,500</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 require immediate action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Notes</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied to Payout</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">Successfully deducted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Deduction Summary</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="amount" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.dn}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.contractor}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    +₹{activity.amount.toLocaleString()}
                    <div className="text-xs text-right text-muted-foreground mt-1">
                      {activity.status} • {activity.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
