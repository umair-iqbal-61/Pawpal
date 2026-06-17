import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import MealLog from '../../components/tracking/MealLog'
import WeightLog from '../../components/tracking/WeightLog'
import VetVisits from '../../components/tracking/VetVisits'
import Reminders from '../../components/tracking/Reminders'
import Chat from '../../components/Chat'

const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', bird: '🐦', fish: '🐟', rabbit: '🐰', other: '🐾' }
const TABS = ['Overview', 'Meals', 'Weight', 'Vet Visits', 'Reminders', 'AI Chat']

export default function PetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [chatData, setChatData] = useState({ meals: [], weight: [], vets: [] })

  useEffect(() => {
    const fetchAll = async () => {
      const { data, error } = await supabase
        .from('pets').select('*').eq('id', id).single()
      if (error) { navigate('/dashboard'); return }
      setPet(data)

      const [meals, weight, vets] = await Promise.all([
        supabase.from('meal_logs').select('*').eq('pet_id', id).order('meal_time', { ascending: false }).limit(5),
        supabase.from('weight_logs').select('*').eq('pet_id', id).order('logged_at', { ascending: false }).limit(3),
        supabase.from('vet_visits').select('*').eq('pet_id', id).order('visit_date', { ascending: false }).limit(3),
      ])
      setChatData({
        meals: meals.data || [],
        weight: weight.data || [],
        vets: vets.data || []
      })
      setLoading(false)
    }
    fetchAll()
  }, [id])

  const handleDelete = async () => {
    if (!confirm(`Delete ${pet.name}? This can't be undone.`)) return
    await supabase.from('pets').delete().eq('id', id)
    navigate('/dashboard')
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-sm text-gray-400 dark:text-gray-600">Loading...</p>
    </div>
  )

  if (!pet) return null

  const emoji = SPECIES_EMOJI[pet.species] || '🐾'

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/dashboard')}
        className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 flex items-center gap-1 transition-colors">
        ← Back
      </button>

      {/* Pet header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-3xl flex-shrink-0">
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{pet.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
              {pet.species}{pet.breed ? ` · ${pet.breed}` : ''}
            </p>
          </div>
          <div className="flex gap-3 sm:gap-4 text-center flex-shrink-0">
            {pet.age && (
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Age</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{pet.age}y</p>
              </div>
            )}
            {pet.weight && (
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Weight</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{pet.weight}kg</p>
              </div>
            )}
            {pet.gender && (
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Gender</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-white capitalize">{pet.gender}</p>
              </div>
            )}
          </div>
        </div>

        {pet.notes && (
          <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl p-3">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-0.5">Notes</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{pet.notes}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 text-xs py-2 px-3 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab
                ? 'bg-white dark:bg-gray-900 text-violet-700 dark:text-violet-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6">
        {activeTab === 'Overview' && (
          <div className="flex flex-col gap-6">
            <MealLog petId={id} />
            <hr className="border-gray-100 dark:border-gray-800" />
            <WeightLog petId={id} />
            <hr className="border-gray-100 dark:border-gray-800" />
            <VetVisits petId={id} />
            <hr className="border-gray-100 dark:border-gray-800" />
            <Reminders petId={id} />
            <hr className="border-gray-100 dark:border-gray-800" />
            <button onClick={handleDelete}
              className="w-full text-sm text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 py-2 rounded-xl border border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-700 transition-colors">
              Delete {pet.name}
            </button>
          </div>
        )}
        {activeTab === 'Meals' && <MealLog petId={id} />}
        {activeTab === 'Weight' && <WeightLog petId={id} />}
        {activeTab === 'Vet Visits' && <VetVisits petId={id} />}
        {activeTab === 'Reminders' && <Reminders petId={id} />}
        {activeTab === 'AI Chat' && (
          <Chat
            pet={pet}
            recentMeals={chatData.meals}
            recentWeight={chatData.weight}
            recentVetVisits={chatData.vets}
          />
        )}
      </div>
    </div>
  )
}