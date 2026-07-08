import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Filter, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { supabase, type DebitNote } from "@/lib/supabase"

export function DebitNotes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [debitNotes, setDebitNotes] = useState<DebitNote[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDebitNotes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("debit_notes")
      .select(`*, contractors(name, company), projects(name)`)
      .order("created_at", { ascending: false })
    if (!error && data) {
      const formatted = data.map((d: any) => ({
        ...d,
        contractor_name: d.contractors?.company || "—",
        project_name: d.projects?.name || "—",
      }))
      setDebitNotes(formatted)
    }
    setLoading(false)
  }

  useEffect(() => { fetchDebitNotes() }, [])

  const filtered = debitNotes.filter(d => {
    const matchSearch =
      d.dn_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.contractor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.project_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "All" || d.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("debit_notes").update({ status: newStatus }).eq("id", id)
    if (!error) setDebitNotes(debitNotes.map(d => d.id === id ? { ...d, status: newStatus } : d))
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("debit_notes").delete().eq("id", id)
    if (!error) setDebitNotes(debitNotes.filter(d => d.id !== id))
  }

  const getStatusVariant = (status: string) => {
    if (status === "Approved") return "default"
    if (status === "Applied") return "secondary"
    return "outline"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Debit Notes</h2>
        <Link to="/debit-notes/create">
          <Button><Plus className="mr-2 h-4 w-4" /> Create Debit Note</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by DN, Contractor, Project..."
            className="w-full bg-background pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading debit notes...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DN Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    No debit notes found. Create your first one!
                  </TableCell>
                </TableRow>
              ) : filtered.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.dn_number}</TableCell>
                  <TableCell>{invoice.date_issued}</TableCell>
                  <TableCell>{invoice.contractor_name}</TableCell>
                  <TableCell>{invoice.project_name}</TableCell>
                  <TableCell className="text-right">₹{Number(invoice.total_amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">View</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Debit Note Preview</DialogTitle>
                          <DialogDescription>Details for {invoice.dn_number}</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-6">
                          <div className="flex justify-between items-start border-b pb-4">
                            <div>
                              <h3 className="font-bold text-lg">{invoice.contractor_name}</h3>
                              <p className="text-sm text-muted-foreground">Project: {invoice.project_name}</p>
                              <p className="text-sm text-muted-foreground">Site: {invoice.site_location}</p>
                            </div>
                            <div className="text-right">
                              <h3 className="font-bold text-lg">{invoice.dn_number}</h3>
                              <p className="text-sm text-muted-foreground">Date: {invoice.date_issued}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                              <span className="text-sm text-muted-foreground">Debit Amount</span>
                              <span className="font-medium">₹{Number(invoice.debit_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                              <span className="text-sm text-muted-foreground">Tax Amount</span>
                              <span className="font-medium">₹{Number(invoice.tax_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-primary/10 p-3 rounded-md">
                              <span className="font-bold">Total Deduction</span>
                              <span className="font-bold text-lg text-primary">₹{Number(invoice.total_amount).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <Badge variant={getStatusVariant(invoice.status)} className="mt-1">{invoice.status}</Badge>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Reason Category</p>
                              <p className="font-medium mt-1">{invoice.reason_category}</p>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <p className="text-sm text-muted-foreground mb-2">Description</p>
                            <p className="text-sm">{invoice.description}</p>
                          </div>

                          <div className="border-t pt-4">
                            <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                            <div className="flex gap-2">
                              {["Pending", "Approved", "Applied"].map((s) => (
                                <Button
                                  key={s}
                                  size="sm"
                                  variant={invoice.status === s ? "default" : "outline"}
                                  onClick={() => handleStatusChange(invoice.id, s)}
                                >
                                  {s}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="flex sm:justify-between w-full">
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(invoice.id)}>Delete</Button>
                          <Button>Print PDF</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
