import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types matching our database schema
export type Contractor = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  gst: string
  pan: string
  address: string
  created_at?: string
}

export type Project = {
  id: string
  name: string
  location: string
  manager: string
  status: string
  created_at?: string
}

export type DebitNote = {
  id: string
  dn_number: string
  date_issued: string
  contractor_id: string
  contractor_name?: string
  project_id: string
  project_name?: string
  site_location: string
  original_invoice?: string
  reason_category: string
  description: string
  debit_amount: number
  tax_amount: number
  total_amount: number
  status: string
  created_at?: string
}
