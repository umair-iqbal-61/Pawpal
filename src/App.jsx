import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import PetList from './pages/pets/PetList'
import AddPet from './pages/pets/AddPet'
import PetDetail from './pages/pets/PetDetail'
import ProtectedRoute from './components/ProtectedRoute'
import { useReminders } from './hooks/useReminders'
import Landing from './pages/Landing'
import AuthCallback from './pages/AuthCallback'
import EditPet from './pages/pets/EditPet'

export default function App() {
  useReminders()
  
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return null

  const Protected = ({ children }) => (
    <ProtectedRoute session={session}>
      <Dashboard>{children}</Dashboard>
    </ProtectedRoute>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!session ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Protected><PetList /></Protected>} />
        <Route path="/pets/add" element={<Protected><AddPet /></Protected>} />
        <Route path="/pets/:id" element={<Protected><PetDetail /></Protected>} />
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/pets/:id/edit" element={<Protected><EditPet /></Protected>} />
      </Routes>
    </BrowserRouter>
  )
}