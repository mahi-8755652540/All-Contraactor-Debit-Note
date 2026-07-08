import React, { useState } from "react"
import { Plus, Search, MoreHorizontal, MapPin, User, Building } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialData = [
  { 
    id: "1", 
    name: "Skyline Tower A", 
    location: "Andheri West, Mumbai", 
    manager: "Rahul Verma",
    status: "Active"
  },
  { 
    id: "2", 
    name: "Oceanview Residency", 
    location: "Worli, Mumbai", 
    manager: "Anita Desai",
    status: "Active"
  },
  { 
    id: "3", 
    name: "Tech Park Phase 2", 
    location: "Hinjewadi, Pune", 
    manager: "Sanjay Gupta",
    status: "Completed"
  },
]

export function Projects() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState(initialData)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "", location: "", manager: "", status: "Active"
  })

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormData({ name: "", location: "", manager: "", status: "Active" })
    setIsDialogOpen(true)
  }

  const handleEdit = (project: any) => {
    setEditingId(project.id)
    setFormData({
      name: project.name,
      location: project.location,
      manager: project.manager,
      status: project.status,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingId) {
      setProjects(projects.map(p => p.id === editingId ? { ...formData, id: editingId } : p))
    } else {
      setProjects([...projects, { ...formData, id: Math.random().toString() }])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Projects</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" /> Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the details of the project here. Click save when you're done." : "Enter the details of the new project here. Click save when you're done."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Project Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Skyline Tower A" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Andheri West, Mumbai" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manager" className="text-right">Manager</Label>
                <Input id="manager" value={formData.manager} onChange={(e) => setFormData({...formData, manager: e.target.value})} placeholder="Rahul Verma" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <div className="col-span-3">
                  <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
            placeholder="Search projects..."
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
              <TableHead>Project Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Project Manager</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">{project.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {project.manager}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={project.status === "Active" ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
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
                      <DropdownMenuItem onClick={() => handleEdit(project)}>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>View Debit Notes</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(project.id)}
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
