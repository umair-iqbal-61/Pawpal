import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'

export default function Chat({ pet, recentMeals, recentWeight, recentVetVisits }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const petContext = `
Pet Name: ${pet.name}
Species: ${pet.species}
Breed: ${pet.breed || 'Unknown'}
Age: ${pet.age ? `${pet.age} years` : 'Unknown'}
Weight: ${pet.weight ? `${pet.weight} kg` : 'Unknown'}
Gender: ${pet.gender || 'Unknown'}
Notes: ${pet.notes || 'None'}

Recent Meals (last 5):
${recentMeals?.length
    ? recentMeals.map(m => `- ${m.food_name}${m.amount ? ` (${m.amount})` : ''} on ${new Date(m.meal_time).toLocaleDateString()}`).join('\n')
    : '- No meals logged yet'}

Weight History (last 3):
${recentWeight?.length
    ? recentWeight.map(w => `- ${w.weight}kg on ${new Date(w.logged_at).toLocaleDateString()}`).join('\n')
    : '- No weight logs yet'}

Recent Vet Visits:
${recentVetVisits?.length
    ? recentVetVisits.map(v => `- ${v.reason} on ${new Date(v.visit_date).toLocaleDateString()}${v.next_visit ? `, next visit: ${new Date(v.next_visit).toLocaleDateString()}` : ''}`).join('\n')
    : '- No vet visits logged yet'}
`.trim()

  const { messages, loading, error, sendMessage, clearChat } = useChat(petContext)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const SUGGESTIONS = [
    `Is ${pet.name}'s diet balanced?`,
    `What's a healthy weight for a ${pet.species}?`,
    `How often should I take ${pet.name} to the vet?`,
    `Any tips for ${pet.name}'s grooming?`,
  ]

  return (
    <div className="flex flex-col h-[600px]">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">🤖 Ask PawPal AI</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">Personalized advice for {pet.name}</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 pr-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-4xl">🐾</div>
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
              Ask me anything about {pet.name}!<br />
              I already know their profile and history.
            </p>
            <div className="flex flex-col gap-2 w-full mt-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-left text-xs bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-800/30 px-4 py-2.5 rounded-xl transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                  🐾
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white rounded-tr-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-sm mr-2 flex-shrink-0">
              🐾
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map(i => (
                  <div key={i}
                    className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400 dark:text-red-500 text-center">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Ask about ${pet.name}...`}
          disabled={loading}
          className="flex-1 min-w-0 border dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 transition-colors"
        />
        <button type="submit" disabled={loading || !input.trim()}
          className="bg-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-violet-700 disabled:opacity-40 transition-colors flex-shrink-0">
          Send
        </button>
      </form>
    </div>
  )
}