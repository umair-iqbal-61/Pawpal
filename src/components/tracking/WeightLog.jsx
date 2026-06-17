import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function WeightLog({ petId }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ weight: '', notes: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('pet_id', petId)
      .order('logged_at', { ascending: false })
      .limit(10)
    setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [petId])

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('weight_logs').insert({
      weight: parseFloat(form.weight),
      notes: form.notes,
      pet_id: petId,
      user_id: user.id
    })
    setForm({ weight: '', notes: '' })
    setShowForm(false)
    setAdding(false)
    fetchLogs()
  }

  const handleDelete = async (id) => {
    await supabase.from('weight_logs').delete().eq('id', id)
    fetchLogs()
  }

  const inputClass = "border dark:border-gray-700 rounded-xl px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"

  const trend = logs.length >= 2
    ? logs[0].weight > logs[1].weight ? '↑'
      : logs[0].weight < logs[1].weight ? '↓' : '→'
    : null

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          ⚖️ Weight Log{trend && (
            <span className={`text-sm ml-1 ${trend === '↑' ? 'text-red-400' :
                trend === '↓' ? 'text-green-500' : 'text-gray-400'
              }`}>{trend}</span>
          )}
        </h3>
        <button onClick={() => setShowForm(!showForm)}
          className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors">
          + Log Weight
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd}
          className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30 rounded-xl p-4 mb-4 flex flex-col gap-3">
          <input className={inputClass} type="number" step="0.1" min="0"
            placeholder="Weight in kg *" value={form.weight}
            onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} required />
          <input className={inputClass} placeholder="Notes (optional)"
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={adding}
              className="flex-1 bg-teal-600 text-white rounded-xl py-1.5 text-sm hover:bg-teal-700 disabled:opacity-50 transition-colors">
              {adding ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 dark:text-gray-600">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-6">No weight logs yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {logs.map(log => (
            <div key={log.id}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{log.weight} kg</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(log.logged_at).toLocaleDateString([], { dateStyle: 'medium' })}
                </p>
                {log.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{log.notes}</p>}
              </div>
              <button onClick={() => handleDelete(log.id)}
                className="text-xs text-red-300 hover:text-red-500 dark:text-red-700 dark:hover:text-red-400 transition-colors">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}