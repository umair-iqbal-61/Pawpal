import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function VetVisits({ petId }) {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ reason: '', vet_name: '', visit_date: '', next_visit: '', notes: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchVisits = async () => {
    const { data } = await supabase
      .from('vet_visits')
      .select('*')
      .eq('pet_id', petId)
      .order('visit_date', { ascending: false })
    setVisits(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchVisits() }, [petId])

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('vet_visits').insert({
      ...form,
      next_visit: form.next_visit || null,
      pet_id: petId,
      user_id: user.id
    })
    setForm({ reason: '', vet_name: '', visit_date: '', next_visit: '', notes: '' })
    setShowForm(false)
    setAdding(false)
    fetchVisits()
  }

  const handleDelete = async (id) => {
    await supabase.from('vet_visits').delete().eq('id', id)
    fetchVisits()
  }

  const inputClass = "border dark:border-gray-700 rounded-xl px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
  const labelClass = "text-xs text-gray-500 dark:text-gray-400 mb-1 block"
  const isUpcoming = (date) => date && new Date(date) > new Date()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">🏥 Vet Visits</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors">
          + Add Visit
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl p-4 mb-4 flex flex-col gap-3">
          <input className={inputClass} placeholder="Reason *" value={form.reason}
            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required />
          <input className={inputClass} placeholder="Vet name" value={form.vet_name}
            onChange={e => setForm(f => ({ ...f, vet_name: e.target.value }))} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Visit date *</label>
              <input className={inputClass} type="date" value={form.visit_date}
                onChange={e => setForm(f => ({ ...f, visit_date: e.target.value }))} required />
            </div>
            <div>
              <label className={labelClass}>Next visit</label>
              <input className={inputClass} type="date" value={form.next_visit}
                onChange={e => setForm(f => ({ ...f, next_visit: e.target.value }))} />
            </div>
          </div>
          <input className={inputClass} placeholder="Notes" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={adding}
              className="flex-1 bg-amber-500 text-white rounded-xl py-1.5 text-sm hover:bg-amber-600 disabled:opacity-50 transition-colors">
              {adding ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 dark:text-gray-600">Loading...</p>
      ) : visits.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-6">No vet visits logged yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {visits.map(visit => (
            <div key={visit.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{visit.reason}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(visit.visit_date).toLocaleDateString([], { dateStyle: 'medium' })}
                    {visit.vet_name && ` · ${visit.vet_name}`}
                  </p>
                  {visit.next_visit && (
                    <p className={`text-xs mt-1 font-medium ${isUpcoming(visit.next_visit)
                        ? 'text-amber-500 dark:text-amber-400'
                        : 'text-gray-400 dark:text-gray-600'
                      }`}>
                      Next: {new Date(visit.next_visit).toLocaleDateString([], { dateStyle: 'medium' })}
                      {isUpcoming(visit.next_visit) && ' ⏰'}
                    </p>
                  )}
                  {visit.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{visit.notes}</p>
                  )}
                </div>
                <button onClick={() => handleDelete(visit.id)}
                  className="text-xs text-red-300 hover:text-red-500 dark:text-red-700 dark:hover:text-red-400 ml-4 transition-colors">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}