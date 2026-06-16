import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useChat(petContext) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setLoading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ messages: updatedMessages, petContext }),
        }
      )

      console.log('Status:', res.status)
      const data = await res.json()

      // Handle error from edge function
      if (data.error) throw new Error(data.error)

      const reply = data.content?.[0]?.text
      if (!reply) throw new Error(`No reply returned. Raw: ${JSON.stringify(data)}`)

      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error('Chat error:', err)
      setError(`Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => setMessages([])

  return { messages, loading, error, sendMessage, clearChat }
}