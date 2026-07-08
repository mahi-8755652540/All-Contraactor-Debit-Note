import React, { useEffect, useState } from "react"
import { Plus, Search, MoreHorizontal, Mail, Phone, Loader2, Users, Edit, Trash2, FileText, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { supabase, type Contractor } from "@/lib/supabase"

const emptyForm = { name: "", company: "", email: "", phone: "", gst: "", pan: "", address: "" }

export function Contractors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)

  const fetchContractors = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("contractors").select("*").order("created_at", { ascending: false })
    if (!error && data) setContractors(data)
    setLoading(false)
  }

  useEffect(() => { fetchContractors() }, [])

  const filtered = contractors.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddNew = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setIsDialogOpen(true)
  }

  const handleEdit = (contractor: Contractor) => {
    setEditingId(contractor.id)
    setFormData({
      name: contractor.name, company: contractor.company,
      email: contractor.email || "", phone: contractor.phone || "",
      gst: contractor.gst || "", pan: contractor.pan || "", address: contractor.address || "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editingId) {
      const { error } = await supabase.from("contractors").update(formData).eq("id", editingId)
      if (!error) await fetchContractors()
    } else {
      const { error } = await supabase.from("contractors").insert([formData])
      if (!error) await fetchContractors()
    }
    setSaving(false)
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("contractors").delete().eq("id", id)
    if (!error) setContractors(contractors.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">Contractors</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your company contractors and partners</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="shadow-md shadow-primary/20 hover:shadow-lg transition-all rounded-full px-6">
              <Plus className="mr-2 h-4 w-4" /> Add New Contractor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-0 shadow-2xl">
            <DialogHeader className="bg-slate-900 text-white p-6 pb-6">
              <DialogTitle className="text-xl font-heading">{editingId ? "Edit Contractor" : "Add New Contractor"}</DialogTitle>
              <DialogDescription className="text-slate-400 mt-1">
                {editingId ? "Update the contractor's profile details." : "Enter details to register a new contractor."}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4">
              {[
                { id: "name", label: "Contact Name", placeholder: "John Doe" },
                { id: "company", label: "Company Name", placeholder: "ABC Corporation" },
                { id: "email", label: "Email Address", placeholder: "contact@abccorp.com" },
                { id: "phone", label: "Phone Number", placeholder: "+91 98765 43210" },
                { id: "gst", label: "GST Number", placeholder: "27XXXXX1234X1ZX" },
                { id: "pan", label: "PAN Number", placeholder: "ABCDE1234F" },
                { id: "address", label: "Full Address", placeholder: "123 Main St, City, State" },
              ].map(({ id, label, placeholder }) => (
                <div key={id} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={id} className="text-right text-sm font-medium text-slate-700">{label}</Label>
                  <Input
                    id={id}
                    value={(formData as any)[id]}
                    onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                    placeholder={placeholder}
                    className="col-span-3 bg-slate-50 border-slate-200 focus:bg-white"
                  />
                </div>
              ))}
            </div>
            <DialogFooter className="p-4 bg-slate-50 border-t border-slate-100">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-white">Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="shadow-md">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Contractor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Toolbar */}
      <Card className="border-0 shadow-soft p-2 flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="relative w-full sm:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search by name, company, or email..."
            className="w-full bg-slate-50/50 border-transparent focus-visible:ring-primary/20 pl-9 rounded-md transition-colors hover:bg-slate-100/50"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Data Table */}
      <Card className="border-0 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <span className="text-muted-foreground font-medium">Fetching contractors...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-600 h-12 w-[300px]">Contractor</TableHead>
                  <TableHead className="font-semibold text-slate-600">Contact Info</TableHead>
                  <TableHead className="font-semibold text-slate-600">Tax Details</TableHead>
                  <TableHead className="font-semibold text-slate-600">Address</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                       <div className="flex flex-col items-center justify-center text-slate-400">
                        <UserPlus className="h-12 w-12 mb-3 stroke-1" />
                        <p className="text-lg font-medium text-slate-900">No contractors found</p>
                        <p className="text-sm">Add a new contractor to get started.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.map((contractor) => (
                  <TableRow key={contractor.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                           {contractor.company.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">{contractor.company}</div>
                            <div className="text-sm text-slate-500 font-medium">{contractor.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />{contractor.phone || "—"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />{contractor.email || "—"}
                          </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">GST <span className="font-medium text-slate-700 normal-case">{contractor.gst || "—"}</span></div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PAN <span className="font-medium text-slate-700 normal-case">{contractor.pan || "—"}</span></div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{contractor.address || "—"}</TableCell>
                    <TableCell className="text-right pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-slate-100 shadow-sm border border-slate-200">
                              <MoreHorizontal className="h-4 w-4 text-slate-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-0 ring-1 ring-slate-200 rounded-xl">
                          <DropdownMenuLabel className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(contractor)} className="font-medium cursor-pointer py-2">
                              <Edit className="h-4 w-4 mr-2 text-blue-500" /> Edit Contractor
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-medium cursor-pointer py-2">
                              <FileText className="h-4 w-4 mr-2 text-slate-500" /> View Debit Notes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="font-medium cursor-pointer py-2 text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => handleDelete(contractor.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Contractor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
