import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const inputClass = "border dark:border-gray-700 rounded-lg px-4 py-2 text-sm w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Welcome back 🐾</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} className={inputClass} required />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} className={inputClass} required />
          <button type="submit" disabled={loading}
            className="bg-violet-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          No account?{' '}
          <Link to="/signup" className="text-violet-600 dark:text-violet-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}