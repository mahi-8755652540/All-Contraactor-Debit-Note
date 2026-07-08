import { useState } from "react"
import { Plus, Search, MoreHorizontal, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const initialData = [
  { 
    id: "1", 
    name: "Ramesh Kumar", 
    company: "ABC Constructions", 
    gst: "27AADCB2230M1Z2", 
    pan: "AADCB2230M",
    address: "Navi Mumbai, Maharashtra",
    email: "contact@abcconstructions.in",
    phone: "+91 98765 43210"
  },
  { 
    id: "2", 
    name: "Suresh Sharma", 
    company: "XYZ Builders", 
    gst: "27BBKCS1120M1Z5", 
    pan: "BBKCS1120M",
    address: "Andheri West, Mumbai",
    email: "info@xyzbuilders.com",
    phone: "+91 98765 12345"
  },
  { 
    id: "3", 
    name: "Vikram Singh", 
    company: "Skyline Infra", 
    gst: "27CCMDP4450M1Z8", 
    pan: "CCMDP4450M",
    address: "Thane West, Maharashtra",
    email: "operations@skylineinfra.in",
    phone: "+91 98765 67890"
  },
]

export function Contractors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [contractors, setContractors] = useState(initialData)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "", company: "", email: "", phone: "", gst: "", pan: "", address: ""
  })

  const handleDelete = (id: string) => {
    setContractors(contractors.filter(c => c.id !== id))
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormData({ name: "", company: "", email: "", phone: "", gst: "", pan: "", address: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (contractor: any) => {
    setEditingId(contractor.id)
    setFormData({
      name: contractor.name,
      company: contractor.company,
      email: contractor.email,
      phone: contractor.phone,
      gst: contractor.gst,
      pan: contractor.pan,
      address: contractor.address,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingId) {
      setContractors(contractors.map(c => c.id === editingId ? { ...formData, id: editingId } : c))
    } else {
      setContractors([...contractors, { ...formData, id: Math.random().toString() }])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Contractors</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" /> Add New Contractor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Contractor" : "Add New Contractor"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the details of the contractor here. Click save when you're done." : "Enter the details of the new contractor here. Click save when you're done."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">Company</Label>
                <Input id="company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="ABC Corp" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="contact@abccorp.com" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gst" className="text-right">GST</Label>
                <Input id="gst" value={formData.gst} onChange={(e) => setFormData({...formData, gst: e.target.value})} placeholder="27XXXXX1234X1ZX" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pan" className="text-right">PAN</Label>
                <Input id="pan" value={formData.pan} onChange={(e) => setFormData({...formData, pan: e.target.value})} placeholder="ABCDE1234F" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="123 Main St, City" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save changes</Button>
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
            {contractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{contractor.company}</div>
                  <div className="text-sm text-muted-foreground">{contractor.name}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {contractor.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="h-3 w-3" />
                    {contractor.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">GST: <span className="font-normal text-muted-foreground">{contractor.gst}</span></div>
                  <div className="text-sm font-medium mt-1">PAN: <span className="font-normal text-muted-foreground">{contractor.pan}</span></div>
                </TableCell>
                <TableCell className="text-sm">
                  {contractor.address}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(contractor)}>Edit Contractor</DropdownMenuItem>
                      <DropdownMenuItem>View Debit Notes</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(contractor.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
