import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link } from "react-router-dom"
import { ArrowLeft, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEffect, useState } from "react"

const formSchema = z.object({
  contractorId: z.string().min(1, { message: "Contractor is required" }),
  projectId: z.string().min(1, { message: "Project is required" }),
  siteLocation: z.string().min(1, { message: "Site location is required" }),
  originalInvoice: z.string().optional(),
  reasonCategory: z.string().min(1, { message: "Reason category is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  debitAmount: z.coerce.number().min(1, { message: "Debit amount must be greater than 0" }),
  taxAmount: z.coerce.number().min(0),
})

export function CreateDebitNote() {
  const [totalDeduction, setTotalDeduction] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      contractorId: "",
      projectId: "",
      siteLocation: "",
      originalInvoice: "",
      reasonCategory: "",
      description: "",
      debitAmount: 0,
      taxAmount: 0,
    },
  })

  const { watch } = form
  const debitAmount = watch("debitAmount")
  const taxAmount = watch("taxAmount")

  useEffect(() => {
    const total = (Number(debitAmount) || 0) + (Number(taxAmount) || 0)
    setTotalDeduction(total)
  }, [debitAmount, taxAmount])

  function onSubmit(values: any) {
    console.log(values)
    // Handle form submission
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/debit-notes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create Debit Note</h2>
          <p className="text-muted-foreground">Issue a new debit note to a contractor.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control as any}
                      name="contractorId"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Contractor Name</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select contractor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">ABC Constructions</SelectItem>
                              <SelectItem value="2">XYZ Builders</SelectItem>
                              <SelectItem value="3">Skyline Infra</SelectItem>
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
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select project" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="p1">Tower A</SelectItem>
                              <SelectItem value="p2">Phase 2</SelectItem>
                              <SelectItem value="p3">Tower B</SelectItem>
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
                      name="siteLocation"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Site Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Block C, Floor 4" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="originalInvoice"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Original Invoice (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="INV-2026-..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Debit Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="reasonCategory"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Reason Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Rework">Rework</SelectItem>
                            <SelectItem value="Water Leakage">Water Leakage</SelectItem>
                            <SelectItem value="Damage">Damage</SelectItem>
                            <SelectItem value="Delay">Delay</SelectItem>
                            <SelectItem value="Overbilling">Overbilling</SelectItem>
                            <SelectItem value="Material Wastage">Material Wastage</SelectItem>
                            <SelectItem value="Poor Workmanship">Poor Workmanship</SelectItem>
                            <SelectItem value="Quality Issue">Quality Issue</SelectItem>
                            <SelectItem value="Safety Violation">Safety Violation</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
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
                          <Textarea 
                            placeholder="Provide full details of the issue..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
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
                  <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mt-1">SVG, PNG, JPG, PDF or MP4 (max. 10MB)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="debitAmount"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Debit Amount (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-4 border-t mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Total Deduction</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{totalDeduction.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full mt-4">Generate Debit Note</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Approval Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        SE
                      </div>
                      <div>
                        <p className="text-sm font-medium">Raised By</p>
                        <p className="text-xs text-muted-foreground">Site Engineer</p>
                      </div>
                    </div>
                    <div className="w-px h-6 bg-border ml-4"></div>
                    <div className="flex items-center gap-3 opacity-50">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm border border-dashed">
                        PM
                      </div>
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
