import { supabase } from './supabase'

export const uploadPetPhoto = async (file, userId, petId) => {
  // Validate file
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  if (file.size > MAX_SIZE) throw new Error('Image must be under 5MB')
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Only JPG, PNG, WebP or GIF allowed')

  const ext = file.name.split('.').pop()
  const filename = `${userId}/${petId}/${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from('pet-media')
    .upload(filename, file, { upsert: false })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('pet-media')
    .getPublicUrl(data.path)

  return publicUrl
}

export const deletePetPhoto = async (url) => {
  // Extract path from URL
  const path = url.split('/pet-media/')[1]
  const { error } = await supabase.storage
    .from('pet-media')
    .remove([path])
  if (error) throw error
}