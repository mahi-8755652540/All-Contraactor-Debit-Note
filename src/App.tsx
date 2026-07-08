import { Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/AppLayout"
import { Dashboard } from "@/pages/Dashboard"
import { DebitNotes } from "@/pages/DebitNotes"
import { CreateDebitNote } from "@/pages/CreateDebitNote"
import { Contractors } from "@/pages/Contractors"
import { Projects } from "@/pages/Projects"
import { Settings } from "@/pages/Settings"
import { Login } from "@/pages/Login"
import { ProtectedRoute } from "@/components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/debit-notes" element={<DebitNotes />} />
          <Route path="/debit-notes/create" element={<CreateDebitNote />} />
          <Route path="/contractors" element={<Contractors />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
