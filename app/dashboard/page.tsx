'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Terminal, Plus, Trash2, ExternalLink, Globe, Lock, Code } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [pastes, setPastes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          router.push('/auth/login')
          return
        }
        setUser(user)
        await fetchPastes(user.id)
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/auth/login')
      }
    }

    const fetchPastes = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('pastes')
          .select('*')
          .eq('author_id', userId)
          .order('created_at', { ascending: false })

        if (!error) {
          setPastes(data || [])
        } else {
          console.error('Fetch pastes error:', error)
        }
      } catch (err) {
        console.error('Fetch pastes error:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [supabase, router])

  const deletePaste = async (id: string) => {
    if (!confirm('Are you sure you want to delete this paste?')) return

    const { error } = await supabase
      .from('pastes')
      .delete()
      .eq('id', id)

    if (!error) {
      setPastes(pastes.filter(p => p.id !== id))
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
            <p className="text-white/50 text-sm mt-1">Manage your snippets and code collection</p>
          </div>
          <Link
            href="/create"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary text-black rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Create New</span>
          </Link>
        </div>

        {pastes.length === 0 ? (
          <div className="glass p-20 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-white/5 rounded-full">
              <Code className="w-12 h-12 text-white/20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">No pastes yet</h2>
              <p className="text-white/40 max-w-xs mx-auto">
                Start sharing your code snippets and they will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastes.map((paste, i) => (
              <motion.div
                key={paste.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 glass-hover group flex flex-col justify-between border-white/[0.05]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-accent-primary bg-accent-primary/5 px-2 py-0.5 rounded tracking-widest uppercase">
                      {paste.language}
                    </span>
                    {paste.is_public ? (
                      <Globe className="w-4 h-4 text-white/20" />
                    ) : (
                      <Lock className="w-4 h-4 text-accent-secondary" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-accent-primary transition-colors">
                    {paste.title}
                  </h3>
                  <p className="text-xs text-white/40 mb-6">
                    Created on {new Date(paste.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <Link
                    href={`/p/${paste.id}`}
                    className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Paste</span>
                  </Link>
                  <button
                    onClick={() => deletePaste(paste.id)}
                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
