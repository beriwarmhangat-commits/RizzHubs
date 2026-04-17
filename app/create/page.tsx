'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Terminal, Save, Globe, Lock, ChevronDown, Check } from 'lucide-react'

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'json', name: 'JSON' },
  { id: 'markdown', name: 'Markdown' },
  { id: 'plaintext', name: 'Plain Text' },
]

export default function CreatePaste() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!content.trim()) {
        setError('Please enter some code content.')
        setLoading(false)
        return
      }

      const { data, error: insertError } = await supabase
        .from('pastes')
        .insert([
          { 
            title: title || 'Untitled',
            content: content.trim(),
            language,
            is_public: isPublic,
            author_id: user?.id || null 
          }
        ])
        .select()
        .single()

      if (insertError) {
        setError(insertError.message || 'Failed to create paste. Please try again.')
        setLoading(false)
      } else if (data) {
        router.push(`/p/${data.id}`)
      } else {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-primary/10 rounded-xl">
              <Terminal className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create New Paste</h1>
              <p className="text-white/50 text-sm">Share your code snippets instantly</p>
            </div>
          </div>
          
          <button
            onClick={handleCreate}
            disabled={!content || loading}
            className="px-6 py-3 bg-accent-primary text-black rounded-xl font-bold hover:bg-accent-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            <input
              type="text"
              placeholder="Paste Title (optional)"
              className="w-full glass p-4 rounded-xl text-white text-lg font-medium placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
              <textarea
                placeholder="Paste your code here..."
                required
                className="relative w-full glass p-6 rounded-2xl text-white font-mono min-h-[500px] resize-y placeholder:text-white/20 focus:outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Settings</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50">Language</label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none appearance-none cursor-pointer"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.id} value={lang.id} className="bg-background">{lang.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-white/50">Privacy</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPublic(true)}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${isPublic ? 'border-accent-primary/50 bg-accent-primary/5 text-accent-primary' : 'border-white/5 bg-white/5 text-white/40'}`}
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-[10px] font-bold">PUBLIC</span>
                  </button>
                  <button
                    onClick={() => setIsPublic(false)}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${!isPublic ? 'border-accent-secondary/50 bg-accent-secondary/5 text-accent-secondary' : 'border-white/5 bg-white/5 text-white/40'}`}
                  >
                    <Lock className="w-5 h-5" />
                    <span className="text-[10px] font-bold">PRIVATE</span>
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-xs text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
