import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Filter, Download, Loader2, FileDown, FileText, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogTrigger,
} from "@/components/ui/dialog"
import { downloadDebitNotePDF } from "@/lib/DebitNotePDF"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Approved</Badge>
      case "Applied":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Applied</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Pending</Badge>
    }
  }

  const exportToCSV = () => {
    if (filtered.length === 0) return

    const headers = [
      "DN Number", "Date Issued", "Contractor", "Project", 
      "Location", "Debit Amount", "Tax Amount", "Total Amount", 
      "Status", "Reason Category", "Description"
    ]

    const csvRows = [headers.join(",")]

    for (const note of filtered) {
      const row = [
        note.dn_number,
        note.date_issued,
        `"${note.contractor_name?.replace(/"/g, '""') || ''}"`,
        `"${note.project_name?.replace(/"/g, '""') || ''}"`,
        `"${note.site_location?.replace(/"/g, '""') || ''}"`,
        note.debit_amount,
        note.tax_amount,
        note.total_amount,
        note.status,
        `"${note.reason_category?.replace(/"/g, '""') || ''}"`,
        `"${note.description?.replace(/"/g, '""') || ''}"`
      ]
      csvRows.push(row.join(","))
    }

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `Debit_Notes_Export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">Debit Notes</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage and track all contractor deductions</p>
          </div>
        </div>
        <Link to="/debit-notes/create">
          <Button className="shadow-md shadow-primary/20 hover:shadow-lg transition-all rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> Create Debit Note
          </Button>
        </Link>
      </div>

      {/* Filters Toolbar */}
      <Card className="border-0 shadow-soft p-2 flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="relative w-full sm:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search by DN, Contractor, Project..."
            className="w-full bg-slate-50/50 border-transparent focus-visible:ring-primary/20 pl-9 rounded-md transition-colors hover:bg-slate-100/50"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border rounded-md p-1">
            <Filter className="h-4 w-4 text-slate-400 ml-2" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] border-0 bg-transparent focus:ring-0 h-8 text-sm font-medium">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={exportToCSV} className="text-slate-600 bg-white shadow-sm border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="border-0 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <span className="text-muted-foreground font-medium">Fetching debit notes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-600 h-12">DN Number</TableHead>
                  <TableHead className="font-semibold text-slate-600">Date Issued</TableHead>
                  <TableHead className="font-semibold text-slate-600">Contractor</TableHead>
                  <TableHead className="font-semibold text-slate-600">Project</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right">Amount (₹)</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <FileText className="h-12 w-12 mb-3 stroke-1" />
                        <p className="text-lg font-medium text-slate-900">No debit notes found</p>
                        <p className="text-sm">Try adjusting your search or create a new one.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.map((invoice) => (
                  <TableRow key={invoice.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-bold text-slate-900">{invoice.dn_number}</TableCell>
                    <TableCell className="text-slate-500 font-medium">{invoice.date_issued}</TableCell>
                    <TableCell>
                        <div className="font-semibold text-slate-900">{invoice.contractor_name}</div>
                    </TableCell>
                    <TableCell className="text-slate-600">{invoice.project_name}</TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                        ₹{Number(invoice.total_amount).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-slate-100 shadow-sm border border-slate-200">
                            <Eye className="h-4 w-4 mr-1.5 text-primary" /> View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 shadow-2xl">
                          <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold font-heading">{invoice.dn_number}</h2>
                                <p className="text-slate-400 mt-1">Issued on {invoice.date_issued}</p>
                            </div>
                            {getStatusBadge(invoice.status)}
                          </div>
                          
                          <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contractor</p>
                                <p className="font-bold text-slate-900">{invoice.contractor_name}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Project & Site</p>
                                <p className="font-bold text-slate-900">{invoice.project_name}</p>
                                <p className="text-sm text-slate-500">{invoice.site_location}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-dashed">
                                <span className="text-sm text-slate-500 font-medium">Debit Amount</span>
                                <span className="font-semibold text-slate-900">₹{Number(invoice.debit_amount).toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-dashed">
                                <span className="text-sm text-slate-500 font-medium">Tax Amount</span>
                                <span className="font-semibold text-slate-900">₹{Number(invoice.tax_amount).toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                                <span className="font-bold text-slate-900">Total Deduction</span>
                                <span className="font-bold text-lg text-primary">₹{Number(invoice.total_amount).toLocaleString("en-IN")}</span>
                              </div>
                            </div>

                            <div className="bg-white border rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reason Category</p>
                                  <Badge variant="outline" className="bg-slate-50">{invoice.reason_category}</Badge>
                              </div>
                              <p className="text-sm text-slate-700 leading-relaxed mt-3">{invoice.description}</p>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Update Status</p>
                                <div className="flex gap-2">
                                  {["Pending", "Approved", "Applied"].map((s) => (
                                    <Button
                                      key={s}
                                      size="sm"
                                      variant={invoice.status === s ? "default" : "outline"}
                                      className={invoice.status === s ? "shadow-md" : "bg-white"}
                                      onClick={() => handleStatusChange(invoice.id, s)}
                                    >
                                      {s}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-4 border-t flex sm:justify-between w-full items-center">
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(invoice.id)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                            <Button onClick={() => downloadDebitNotePDF(invoice)} className="shadow-md">
                              <FileDown className="mr-2 h-4 w-4" /> Download Official PDF
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}
