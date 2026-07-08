import React, { useEffect, useState } from "react"
import { Plus, Search, MoreHorizontal, Mail, Phone, Loader2 } from "lucide-react"
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

  // Fetch all contractors from Supabase
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Contractors</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Add New Contractor</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Contractor" : "Add New Contractor"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update contractor details." : "Enter details of the new contractor."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {[
                { id: "name", label: "Name", placeholder: "John Doe" },
                { id: "company", label: "Company", placeholder: "ABC Corp" },
                { id: "email", label: "Email", placeholder: "contact@abccorp.com" },
                { id: "phone", label: "Phone", placeholder: "+91 98765 43210" },
                { id: "gst", label: "GST", placeholder: "27XXXXX1234X1ZX" },
                { id: "pan", label: "PAN", placeholder: "ABCDE1234F" },
                { id: "address", label: "Address", placeholder: "123 Main St, City" },
              ].map(({ id, label, placeholder }) => (
                <div key={id} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={id} className="text-right">{label}</Label>
                  <Input
                    id={id}
                    value={(formData as any)[id]}
                    onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                    placeholder={placeholder}
                    className="col-span-3"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contractors..."
            className="w-full bg-background pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading contractors...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contractor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Tax Details</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    No contractors found.
                  </TableCell>
                </TableRow>
              ) : filtered.map((contractor) => (
                <TableRow key={contractor.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{contractor.company}</div>
                    <div className="text-sm text-muted-foreground">{contractor.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm"><Phone className="h-3 w-3 text-muted-foreground" />{contractor.phone}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1"><Mail className="h-3 w-3" />{contractor.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">GST: <span className="font-normal text-muted-foreground">{contractor.gst}</span></div>
                    <div className="text-sm font-medium mt-1">PAN: <span className="font-normal text-muted-foreground">{contractor.pan}</span></div>
                  </TableCell>
                  <TableCell className="text-sm">{contractor.address}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(contractor)}>Edit Contractor</DropdownMenuItem>
                        <DropdownMenuItem>View Debit Notes</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(contractor.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
