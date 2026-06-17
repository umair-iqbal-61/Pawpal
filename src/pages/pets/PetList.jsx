import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import PetCard from '../../components/PetCard'

export default function PetList() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPets = async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setPets(data)
      setLoading(false)
    }
    fetchPets()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 dark:text-gray-600 text-sm">Loading your pets...</p>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Pets</h2>
        <Link to="/pets/add"
          className="bg-violet-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
          + Add Pet
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🐾</p>
          <p className="font-medium text-gray-700 dark:text-gray-300">No pets yet</p>
          <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">Add your first pet to get started</p>
          <Link to="/pets/add"
            className="inline-block mt-4 bg-violet-600 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors">
            Add a pet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pets.map(pet => <PetCard key={pet.id} pet={pet} />)}
        </div>
      )}
    </div>
  )
}