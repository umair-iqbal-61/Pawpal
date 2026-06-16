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

  if (loading) return <p className="text-gray-400 text-sm">Loading your pets...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Pets</h2>
        <Link
          to="/pets/add"
          className="bg-violet-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-violet-700"
        >
          + Add Pet
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🐾</p>
          <p className="font-medium">No pets yet</p>
          <p className="text-sm mt-1">Add your first pet to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pets.map(pet => <PetCard key={pet.id} pet={pet} />)}
        </div>
      )}
    </div>
  )
}