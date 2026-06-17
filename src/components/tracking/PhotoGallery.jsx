import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadPetPhoto, deletePetPhoto } from '../../lib/storage'

export default function PhotoGallery({ petId }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null) // full screen preview
  const [caption, setCaption] = useState('')
  const fileRef = useRef()

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('pet_photos')
      .select('*')
      .eq('pet_id', petId)
      .order('created_at', { ascending: false })
    setPhotos(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPhotos() }, [petId])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const url = await uploadPetPhoto(file, user.id, petId)

      await supabase.from('pet_photos').insert({
        pet_id: petId,
        user_id: user.id,
        url,
        caption: caption || null
      })

      setCaption('')
      fetchPhotos()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      fileRef.current.value = ''
    }
  }

  const handleDelete = async (photo) => {
    if (!confirm('Delete this photo?')) return
    try {
      await deletePetPhoto(photo.url)
      await supabase.from('pet_photos').delete().eq('id', photo.id)
      fetchPhotos()
      if (preview?.id === photo.id) setPreview(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">📸 Photo Gallery</h3>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="text-xs bg-pink-500 text-white px-3 py-1.5 rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors">
          {uploading ? 'Uploading...' : '+ Add Photo'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleUpload}
      />

      {error && (
        <p className="text-xs text-red-400 dark:text-red-500 mb-3">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 dark:text-gray-600">Loading...</p>
      ) : photos.length === 0 ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="h-40 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 cursor-pointer hover:border-pink-300 dark:hover:border-pink-700 transition-colors">
          <p className="text-3xl">📷</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Tap to add your first photo</p>
          <p className="text-xs text-gray-300 dark:text-gray-600">JPG, PNG, WebP up to 5MB</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {/* Upload tile */}
          <div
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-pink-300 dark:hover:border-pink-700 transition-colors">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <p className="text-2xl">📷</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add</p>
              </>
            )}
          </div>

          {/* Photo tiles */}
          {photos.map(photo => (
            <div key={photo.id}
              className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
              onClick={() => setPreview(photo)}>
              <img
                src={photo.url}
                alt={photo.caption || 'Pet photo'}
                className="w-full h-full object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                {photo.caption && (
                  <p className="text-white text-xs truncate flex-1">{photo.caption}</p>
                )}
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(photo) }}
                  className="text-white/80 hover:text-red-400 transition-colors ml-auto text-xs">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full screen preview */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}>
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden max-w-lg w-full shadow-xl"
            onClick={e => e.stopPropagation()}>
            <img
              src={preview.url}
              alt={preview.caption || 'Pet photo'}
              className="w-full max-h-96 object-contain bg-gray-50 dark:bg-gray-800"
            />
            <div className="p-4 flex justify-between items-center">
              <div>
                {preview.caption && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">{preview.caption}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {new Date(preview.created_at).toLocaleDateString([], { dateStyle: 'medium' })}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(preview)}
                  className="text-sm text-red-400 hover:text-red-600 transition-colors">
                  Delete
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}