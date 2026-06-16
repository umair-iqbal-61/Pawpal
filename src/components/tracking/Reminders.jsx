import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const TYPES = ['feeding', 'medication', 'vet', 'grooming', 'other']
const ALL_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const TYPE_EMOJI = { feeding: '🍽️', medication: '💊', vet: '🏥', grooming: '✂️', other: '🔔' }

export default function Reminders({ petId }) {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [notifStatus, setNotifStatus] = useState(Notification?.permission || 'default')
  const [form, setForm] = useState({
    title: '', reminder_type: 'feeding', remind_at: '08:00', days: ['daily']
  })

  const fetchReminders = async () => {
    const { data } = await supabase
      .from('reminders')
      .select('*')
      .eq('pet_id', petId)
      .order('remind_at')
    setReminders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchReminders() }, [petId])

  const requestNotifPermission = async () => {
    const result = await Notification.requestPermission()
    setNotifStatus(result)
  }

  const toggleDay = (day) => {
    if (day === 'daily') {
      setForm(f => ({ ...f, days: ['daily'] }))
      return
    }
    setForm(f => {
      const days = f.days.filter(d => d !== 'daily')
      return {
        ...f,
        days: days.includes(day) ? days.filter(d => d !== day) : [...days, day]
      }
    })
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (form.days.length === 0) return alert('Pick at least one day')
    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('reminders').insert({ ...form, pet_id: petId, user_id: user.id })
    setForm({ title: '', reminder_type: 'feeding', remind_at: '08:00', days: ['daily'] })
    setShowForm(false)
    setAdding(false)
    fetchReminders()
  }

  const toggleActive = async (reminder) => {
    await supabase.from('reminders').update({ is_active: !reminder.is_active }).eq('id', reminder.id)
    fetchReminders()
  }

  const handleDelete = async (id) => {
    await supabase.from('reminders').delete().eq('id', id)
    fetchReminders()
  }

  const inputClass = "border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-violet-400"

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">🔔 Reminders</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700">
          + Add Reminder
        </button>
      </div>

      {/* Notification permission banner */}
      {notifStatus !== 'granted' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex justify-between items-center">
          <p className="text-xs text-amber-700">
            {notifStatus === 'denied'
              ? '🚫 Notifications blocked. Enable them in browser settings.'
              : '🔔 Enable notifications to get reminder alerts'}
          </p>
          {notifStatus !== 'denied' && (
            <button onClick={requestNotifPermission}
              className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 ml-3 whitespace-nowrap">
              Enable
            </button>
          )}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-violet-50 rounded-xl p-4 mb-4 flex flex-col gap-3">
          <input className={inputClass} placeholder="Reminder title *" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select className={inputClass} value={form.reminder_type}
                onChange={e => setForm(f => ({ ...f, reminder_type: e.target.value }))}>
                {TYPES.map(t => (
                  <option key={t} value={t}>{TYPE_EMOJI[t]} {t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Time</label>
              <input className={inputClass} type="time" value={form.remind_at}
                onChange={e => setForm(f => ({ ...f, remind_at: e.target.value }))} required />
            </div>
          </div>

          {/* Day picker */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Repeat</label>
            <div className="flex gap-1.5 flex-wrap">
              <button type="button"
                onClick={() => toggleDay('daily')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  form.days.includes('daily') ? 'bg-violet-600 text-white' : 'bg-white border text-gray-500'
                }`}>
                Daily
              </button>
              {ALL_DAYS.map(day => (
                <button key={day} type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    form.days.includes(day) && !form.days.includes('daily')
                      ? 'bg-violet-600 text-white'
                      : 'bg-white border text-gray-500'
                  }`}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 border rounded-xl py-1.5 text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={adding}
              className="flex-1 bg-violet-600 text-white rounded-xl py-1.5 text-sm disabled:opacity-50">
              {adding ? 'Saving...' : 'Save Reminder'}
            </button>
          </div>
        </form>
      )}

      {/* Reminder list */}
      {loading ? <p className="text-sm text-gray-400">Loading...</p> : reminders.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No reminders set yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {reminders.map(r => (
            <div key={r.id} className={`flex items-center justify-between rounded-xl px-4 py-3 transition-opacity ${
              r.is_active ? 'bg-gray-50' : 'bg-gray-50 opacity-50'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{TYPE_EMOJI[r.reminder_type]}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.title}</p>
                  <p className="text-xs text-gray-400">
                    {r.remind_at.slice(0, 5)} ·{' '}
                    {r.days.includes('daily') ? 'Every day' : r.days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Toggle active */}
                <button onClick={() => toggleActive(r)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${r.is_active ? 'bg-violet-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    r.is_active ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
                <button onClick={() => handleDelete(r.id)} className="text-xs text-red-300 hover:text-red-500">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}