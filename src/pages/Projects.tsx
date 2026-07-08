import React, { useEffect, useState } from "react"
import { Plus, Search, MoreHorizontal, MapPin, User, Building, Loader2, Edit, Trash2, FolderPlus, FileText } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { supabase, type Project } from "@/lib/supabase"

const emptyForm = { name: "", location: "", manager: "", status: "Active" }

export function Projects() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
    if (!error && data) setProjects(data)
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.manager?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddNew = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setIsDialogOpen(true)
  }

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setFormData({ name: project.name, location: project.location || "", manager: project.manager || "", status: project.status || "Active" })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editingId) {
      const { error } = await supabase.from("projects").update(formData).eq("id", editingId)
      if (!error) await fetchProjects()
    } else {
      const { error } = await supabase.from("projects").insert([formData])
      if (!error) await fetchProjects()
    }
    setSaving(false)
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (!error) setProjects(projects.filter(p => p.id !== id))
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Active</Badge>
      case "Completed":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Completed</Badge>
      case "On Hold":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">On Hold</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">Projects</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage ongoing construction and development sites</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="shadow-md shadow-primary/20 hover:shadow-lg transition-all rounded-full px-6">
              <Plus className="mr-2 h-4 w-4" /> Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-0 shadow-2xl">
            <DialogHeader className="bg-slate-900 text-white p-6 pb-6">
              <DialogTitle className="text-xl font-heading">{editingId ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription className="text-slate-400 mt-1">
                {editingId ? "Update site details and project manager." : "Enter details for the new construction site."}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-sm font-medium text-slate-700">Project Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Skyline Tower A" className="col-span-3 bg-slate-50 border-slate-200 focus:bg-white" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right text-sm font-medium text-slate-700">Location</Label>
                <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Andheri West, Mumbai" className="col-span-3 bg-slate-50 border-slate-200 focus:bg-white" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manager" className="text-right text-sm font-medium text-slate-700">Manager</Label>
                <Input id="manager" value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} placeholder="Rahul Verma" className="col-span-3 bg-slate-50 border-slate-200 focus:bg-white" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right text-sm font-medium text-slate-700">Status</Label>
                <div className="col-span-3">
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                    <SelectTrigger id="status" className="w-full bg-slate-50 border-slate-200 focus:bg-white"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="p-4 bg-slate-50 border-t border-slate-100">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-white">Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="shadow-md">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Unified Table Card */}
      <Card className="border-0 shadow-soft overflow-hidden bg-white">
        {/* Filters Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative w-full sm:max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="w-full bg-white border-slate-200 focus-visible:ring-primary/20 pl-9 rounded-md shadow-sm"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <span className="text-muted-foreground font-medium">Fetching projects...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-600 h-12 w-[350px]">Project Name</TableHead>
                  <TableHead className="font-semibold text-slate-600">Location</TableHead>
                  <TableHead className="font-semibold text-slate-600">Project Manager</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                       <div className="flex flex-col items-center justify-center text-slate-400">
                        <FolderPlus className="h-12 w-12 mb-3 stroke-1" />
                        <p className="text-lg font-medium text-slate-900">No projects found</p>
                        <p className="text-sm">Add a new site project to get started.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.map((project) => (
                  <TableRow key={project.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                           <Building className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-slate-900">{project.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <MapPin className="h-4 w-4 text-slate-400" />{project.location || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <User className="h-4 w-4 text-slate-400" />{project.manager || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(project.status || "")}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-100 shadow-sm border border-slate-200">
                              <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-0 ring-1 ring-slate-200 rounded-xl">
                          <DropdownMenuLabel className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(project)} className="font-medium cursor-pointer py-2">
                              <Edit className="h-4 w-4 mr-2 text-blue-500" /> Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-medium cursor-pointer py-2">
                              <FileText className="h-4 w-4 mr-2 text-slate-500" /> View Debit Notes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="font-medium cursor-pointer py-2 text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => handleDelete(project.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Project
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
