import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const SPECIES = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'other']
const GENDERS = ['male', 'female']

export default function AddPet() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', species: 'dog', breed: '',
    age: '', weight: '', gender: 'male', notes: ''
  })

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('pets').insert({
      ...form,
      age: form.age ? parseFloat(form.age) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      user_id: user.id
    })

    if (error) { setError(error.message); setLoading(false); return }
    navigate('/dashboard')
  }

  const inputClass = "border rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-violet-400"

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6">Add a New Pet 🐾</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Pet Name *</label>
          <input className={inputClass} placeholder="e.g. Bruno" value={form.name} onChange={set('name')} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Species *</label>
            <select className={inputClass} value={form.species} onChange={set('species')}>
              {SPECIES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Gender</label>
            <select className={inputClass} value={form.gender} onChange={set('gender')}>
              {GENDERS.map(g => <option key={g} value={g} className="capitalize">{g}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Breed</label>
          <input className={inputClass} placeholder="e.g. Golden Retriever" value={form.breed} onChange={set('breed')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Age (years)</label>
            <input className={inputClass} type="number" min="0" step="0.1" placeholder="e.g. 3" value={form.age} onChange={set('age')} />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Weight (kg)</label>
            <input className={inputClass} type="number" min="0" step="0.1" placeholder="e.g. 12.5" value={form.weight} onChange={set('weight')} />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Notes</label>
          <textarea
            className={`${inputClass} resize-none`} rows={3}
            placeholder="Any allergies, medical history, etc."
            value={form.notes} onChange={set('notes')}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/dashboard')}
            className="flex-1 border rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-violet-600 text-white rounded-xl py-2 text-sm font-medium hover:bg-violet-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Pet'}
          </button>
        </div>
      </form>
    </div>
  )
}