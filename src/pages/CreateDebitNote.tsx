import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, UploadCloud, Loader2, X, File as FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEffect, useState, useRef } from "react"
import { supabase, type Contractor, type Project } from "@/lib/supabase"

const formSchema = z.object({
  contractorId: z.string().min(1, { message: "Contractor is required" }),
  projectId: z.string().min(1, { message: "Project is required" }),
  siteLocation: z.string().min(1, { message: "Site location is required" }),
  dateIssued: z.string().min(1, { message: "Date is required" }),
  originalInvoice: z.string().optional(),
  reasonCategory: z.string().min(1, { message: "Reason category is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  debitAmount: z.coerce.number().min(1, { message: "Debit amount must be greater than 0" }),
  taxAmount: z.coerce.number().min(0),
})

export function CreateDebitNote() {
  const navigate = useNavigate()
  const [totalDeduction, setTotalDeduction] = useState(0)
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [dnNumber, setDnNumber] = useState("DN-2026-001")
  const [saving, setSaving] = useState(false)
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidenceFile(e.target.files[0])
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      contractorId: "", projectId: "", siteLocation: "",
      dateIssued: new Date().toISOString().split("T")[0],
      originalInvoice: "", reasonCategory: "", description: "",
      debitAmount: 0, taxAmount: 0,
    },
  })

  const { watch } = form
  const debitAmount = watch("debitAmount")
  const taxAmount = watch("taxAmount")

  useEffect(() => {
    setTotalDeduction((Number(debitAmount) || 0) + (Number(taxAmount) || 0))
  }, [debitAmount, taxAmount])

  // Load contractors and projects from Supabase
  useEffect(() => {
    const load = async () => {
      const [{ data: c }, { data: p }] = await Promise.all([
        supabase.from("contractors").select("*").order("company"),
        supabase.from("projects").select("*").order("name"),
      ])
      if (c) setContractors(c)
      if (p) setProjects(p)

      // Auto-generate DN number
      const { count } = await supabase.from("debit_notes").select("*", { count: "exact", head: true })
      const year = new Date().getFullYear()
      const next = String((count || 0) + 1).padStart(3, "0")
      setDnNumber(`DN-${year}-${next}`)
    }
    load()
  }, [])

  async function onSubmit(values: any) {
    setSaving(true)
    let evidence_url = null
    
    if (evidenceFile) {
      const fileExt = evidenceFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${dnNumber}/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(filePath, evidenceFile)
        
      if (uploadError) {
        alert("Error uploading evidence: " + uploadError.message)
        setSaving(false)
        return
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('evidence')
        .getPublicUrl(filePath)
        
      evidence_url = publicUrl
    }

    const payload = {
      dn_number: dnNumber,
      date_issued: values.dateIssued,
      contractor_id: values.contractorId,
      project_id: values.projectId,
      site_location: values.siteLocation,
      original_invoice: values.originalInvoice || null,
      evidence_url: evidence_url,
      reason_category: values.reasonCategory,
      description: values.description,
      debit_amount: Number(values.debitAmount),
      tax_amount: Number(values.taxAmount),
      status: "Pending",
    }
    const { error } = await supabase.from("debit_notes").insert([payload])
    if (!error) {
      navigate("/debit-notes")
    } else {
      alert("Error saving debit note: " + error.message)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/debit-notes">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create Debit Note</h2>
          <p className="text-muted-foreground">Issue a new debit note to a contractor.</p>
        </div>
      </div>

      {/* DN Number Badge */}
      <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2">
        <span className="text-sm text-muted-foreground">Auto-generated DN Number:</span>
        <span className="font-bold text-primary text-lg">{dnNumber}</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control as any}
                      name="contractorId"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Contractor Name</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select contractor" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {contractors.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.company} — {c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="projectId"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {projects.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control as any}
                      name="dateIssued"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Date Issued</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="siteLocation"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Site Location</FormLabel>
                          <FormControl><Input placeholder="e.g. Block C, Floor 4" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control as any}
                    name="originalInvoice"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Original Invoice Number (Optional)</FormLabel>
                        <FormControl><Input placeholder="INV-2026-..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Debit Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="reasonCategory"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Reason Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {["Rework","Water Leakage","Damage","Delay","Overbilling","Material Wastage","Poor Workmanship","Quality Issue","Safety Violation","Other"].map(r => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="description"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Provide full details of the issue..." className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evidence Upload</CardTitle>
                  <CardDescription>Upload photos, videos, PDFs, or invoice copies</CardDescription>
                </CardHeader>
                <CardContent>
                  {!evidenceFile ? (
                    <div 
                      className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors relative"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*,video/mp4,application/pdf"
                        onChange={handleFileSelect}
                      />
                      <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground mt-1">SVG, PNG, JPG, PDF or MP4 (max. 10MB)</p>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-white rounded shadow-sm border border-slate-100">
                          <FileIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-medium text-sm text-slate-900 truncate pr-4">{evidenceFile.name}</p>
                          <p className="text-xs text-muted-foreground">{(evidenceFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" type="button" className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0" onClick={() => setEvidenceFile(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Financial Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="debitAmount"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Debit Amount (₹)</FormLabel>
                        <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="taxAmount"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Tax Amount (₹)</FormLabel>
                        <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-4 border-t mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Total Deduction</span>
                      <span className="text-xl font-bold text-primary">₹{totalDeduction.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-4" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Debit Note
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Approval Workflow</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">SE</div>
                      <div>
                        <p className="text-sm font-medium">Raised By</p>
                        <p className="text-xs text-muted-foreground">Site Engineer</p>
                      </div>
                    </div>
                    <div className="w-px h-6 bg-border ml-4"></div>
                    <div className="flex items-center gap-3 opacity-50">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm border border-dashed">PM</div>
                      <div>
                        <p className="text-sm font-medium">Reviewed By</p>
                        <p className="text-xs text-muted-foreground">Project Manager</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
