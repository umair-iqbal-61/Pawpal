import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate('/dashboard')
      else navigate('/login')
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <p className="text-2xl mb-3">🐾</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Signing you in...</p>
      </div>
    </div>
  )
}