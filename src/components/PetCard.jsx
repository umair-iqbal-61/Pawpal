import { Link } from 'react-router-dom'

const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', bird: '🐦', fish: '🐟', rabbit: '🐰', other: '🐾' }

export default function PetCard({ pet }) {
  const emoji = SPECIES_EMOJI[pet.species] || '🐾'

  return (
    <Link to={`/pets/${pet.id}`} className="block">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-2xl">
            {pet.avatar_url
              ? <img src={pet.avatar_url} className="w-full h-full rounded-full object-cover" alt={pet.name} />
              : emoji}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{pet.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{pet.species} {pet.breed ? `· ${pet.breed}` : ''}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{pet.age ? `${pet.age} yrs old` : ''} {pet.gender ? `· ${pet.gender}` : ''}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}