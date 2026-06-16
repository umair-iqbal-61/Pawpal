import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const DAYS_MAP = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 }

export function useReminders() {
  const intervalRef = useRef(null)

  const requestPermission = async () => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    const result = await Notification.requestPermission()
    return result === 'granted'
  }

  const checkAndFire = async () => {
    if (Notification.permission !== 'granted') return

    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const currentDay = Object.keys(DAYS_MAP)[now.getDay()]

    const { data: reminders } = await supabase
      .from('reminders')
      .select('*, pets(name)')
      .eq('is_active', true)

    if (!reminders) return

    reminders.forEach(r => {
      const reminderTime = r.remind_at.slice(0, 5) // 'HH:MM'
      const isToday = r.days.includes('daily') || r.days.includes(currentDay)
      if (reminderTime === currentTime && isToday) {
        new Notification(`🐾 ${r.pets?.name} — ${r.title}`, {
          body: `Time for: ${r.reminder_type}`,
          icon: '/favicon.ico'
        })
      }
    })
  }

  useEffect(() => {
    requestPermission()
    // Check every minute
    intervalRef.current = setInterval(checkAndFire, 60 * 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  return { requestPermission }
}