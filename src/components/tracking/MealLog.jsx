import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function MealLog({ petId }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ food_name: '', amount: '', notes: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('pet_id', petId)
      .order('meal_time', { ascending: false })
      .limit(10)
    setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [petId])

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('meal_logs').insert({ ...form, pet_id: petId, user_id: user.id })
    setForm({ food_name: '', amount: '', notes: '' })
    setShowForm(false)
    setAdding(false)
    fetchLogs()
  }

  const handleDelete = async (id) => {
    await supabase.from('meal_logs').delete().eq('id', id)
    fetchLogs()
  }

  const inputClass = "border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-violet-400"

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">🍽️ Meal Log</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700">
          + Add Meal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-violet-50 rounded-xl p-4 mb-4 flex flex-col gap-3">
          <input className={inputClass} placeholder="Food name *" value={form.food_name}
            onChange={e => setForm(f => ({ ...f, food_name: e.target.value }))} required />
          <input className={inputClass} placeholder="Amount (e.g. 1 cup)" value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          <input className={inputClass} placeholder="Notes (optional)" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 border rounded-xl py-1.5 text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={adding}
              className="flex-1 bg-violet-600 text-white rounded-xl py-1.5 text-sm disabled:opacity-50">
              {adding ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {loading ? <p className="text-sm text-gray-400">Loading...</p> : logs.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No meals logged yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {logs.map(log => (
            <div key={log.id} className="flex justify-between items-start bg-gray-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{log.food_name}</p>
                <p className="text-xs text-gray-400">
                  {log.amount && `${log.amount} · `}
                  {new Date(log.meal_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                {log.notes && <p className="text-xs text-gray-500 mt-0.5">{log.notes}</p>}
              </div>
              <button onClick={() => handleDelete(log.id)} className="text-xs text-red-300 hover:text-red-500 ml-4">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}