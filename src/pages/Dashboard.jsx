import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Dashboard({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-violet-600 text-lg">🐾 PawPal</Link>
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-gray-400 hover:text-red-500">
          Log out
        </button>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}