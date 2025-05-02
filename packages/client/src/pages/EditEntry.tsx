import { useState, useRef, useEffect } from 'react'
import EntryHeader from '#/components/EntryHeader'
import api from '#/services/api'
import { useSearchParams, useNavigate } from 'react-router-dom'

interface EntryData {
  title?: string
  subtitle?: string
  content?: string
}

export default function EditEntry() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rkey = searchParams.get('rkey')

  // Track last saved values
  const lastSaved = useRef({ title: '', subtitle: '', content: '' })
  const isDirty =
    title !== lastSaved.current.title ||
    subtitle !== lastSaved.current.subtitle ||
    content !== lastSaved.current.content

  useEffect(() => {
    const fetchEntry = async () => {
      if (!rkey) return
      
      try {
        const response = await api.getEntry({ repo: 'self', rkey })
        const entry = response.value as EntryData
        setTitle(entry.title || '')
        setSubtitle(entry.subtitle || '')
        setContent(entry.content || '')
        lastSaved.current = {
          title: entry.title || '',
          subtitle: entry.subtitle || '',
          content: entry.content || ''
        }
      } catch (err) {
        console.error('Failed to fetch entry:', err)
      }
    }

    fetchEntry()
  }, [rkey])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      let response
      if (rkey) {
        response = await api.sendEntry({ title, subtitle, content, rkey })
      } else {
        response = await api.sendEntry({ title, subtitle, content })
        // If this was a new entry, extract rkey from the entry URI and navigate
        const entryUri = response.uri
        if (entryUri) {
          const newRkey = entryUri.split('/').pop()
          if (newRkey) {
            navigate(`/edit?rkey=${newRkey}`)
          }
        }
      }
      lastSaved.current = { title, subtitle, content }
      
      // Use both methods to ensure all components update
      // 1. Direct query invalidation
      window.dispatchEvent(new CustomEvent('entry-changed', { 
        detail: { action: rkey ? 'update' : 'create' }
      }))
      
      // After saving, navigate back to the home page to see the updated list
      if (!rkey) { // Only for new entries
        setTimeout(() => navigate('/'), 300)
      }
    } catch (err) {
      alert(`Failed to save entry: ${err}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-full">
      <EntryHeader onSave={handleSave} isSaving={isSaving} isDirty={isDirty} />
      {/* Editor area */}
      <div className="flex-1 max-w-4xl mx-auto flex flex-col justify-start pt-12 pb-24 w-full">
        <div className="w-full px-8">
          <input
            className="w-full text-4xl font-bold mb-2 outline-none border-none bg-transparent placeholder-gray-300 dark:placeholder-gray-600"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <input
            className="w-full text-xl mb-6 outline-none border-none bg-transparent placeholder-gray-300 dark:placeholder-gray-600"
            placeholder="Add a subtitle..."
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
          />
          <textarea
            className="w-full min-h-[200px] text-lg outline-none border-none bg-transparent placeholder-gray-300 dark:placeholder-gray-600 resize-none"
            placeholder="Start writing..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
} 