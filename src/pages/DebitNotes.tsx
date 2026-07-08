import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const data = [
  { id: "1", dn: "DN-2026-001", date: "2026-07-08", contractor: "ABC Constructions", project: "Tower A", amount: 50000, status: "Pending" },
  { id: "2", dn: "DN-2026-002", date: "2026-07-07", contractor: "XYZ Builders", project: "Phase 2", amount: 12000, status: "Approved" },
  { id: "3", dn: "DN-2026-003", date: "2026-07-05", contractor: "Skyline Infra", project: "Tower B", amount: 35000, status: "Applied" },
]

export function DebitNotes() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Debit Notes</h2>
        <Link to="/debit-notes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Debit Note
          </Button>
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
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
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
            {data.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.dn}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.contractor}</TableCell>
                <TableCell>{invoice.project}</TableCell>
                <TableCell className="text-right">₹{invoice.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={
                    invoice.status === 'Approved' ? 'default' : 
                    invoice.status === 'Applied' ? 'secondary' : 'outline'
                  }>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">View</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Debit Note Preview</DialogTitle>
                        <DialogDescription>
                          Details for {invoice.dn}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-6">
                        <div className="flex justify-between items-start border-b pb-4">
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{invoice.contractor}</h3>
                            <p className="text-sm text-muted-foreground">Project: {invoice.project}</p>
                          </div>
                          <div className="text-right">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{invoice.dn}</h3>
                            <p className="text-sm text-muted-foreground">Date: {invoice.date}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                            <span className="font-medium">Total Amount</span>
                            <span className="font-bold text-lg">₹{invoice.amount.toLocaleString()}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <Badge variant={
                                invoice.status === 'Approved' ? 'default' : 
                                invoice.status === 'Applied' ? 'secondary' : 'outline'
                              } className="mt-1">
                                {invoice.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Reason Category</p>
                              <p className="font-medium mt-1">Material Waste</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <p className="text-sm text-muted-foreground mb-2">Description</p>
                          <p className="text-sm">Deduction for excess material waste during phase 1 completion.</p>
                        </div>
                      </div>
                      <DialogFooter className="flex sm:justify-between w-full">
                        <Button variant="outline">Print PDF</Button>
                        <Button>Send to Contractor</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
