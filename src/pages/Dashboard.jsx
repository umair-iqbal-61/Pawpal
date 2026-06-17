import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import DarkModeToggle from '../components/DarkModeToggle'

export default function Dashboard({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-violet-600 text-lg">🐾 PawPal</Link>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            Log out
          </button>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}