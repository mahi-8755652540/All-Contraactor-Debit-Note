import { Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/AppLayout"
import { Dashboard } from "@/pages/Dashboard"
import { DebitNotes } from "@/pages/DebitNotes"
import { CreateDebitNote } from "@/pages/CreateDebitNote"
import { Contractors } from "@/pages/Contractors"
import { Projects } from "@/pages/Projects"
import { Settings } from "@/pages/Settings"

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/debit-notes" element={<DebitNotes />} />
        <Route path="/debit-notes/create" element={<CreateDebitNote />} />
        <Route path="/contractors" element={<Contractors />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
        {/* Placeholders for other routes */}
      </Route>
    </Routes>
  )
}

export default App
