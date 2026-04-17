'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useParams } from 'next/navigation'
import { Terminal, Calendar, User, Copy, Check } from 'lucide-react'

export default function ViewPaste() {
  const { id } = useParams()
  const [paste, setPaste] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchPaste = async () => {
      const { data, error } = await supabase
        .from('pastes')
        .select('*, profiles(username)')
        .eq('id', id)
        .single()

      if (!error) setPaste(data)
      setLoading(false)
    }

    fetchPaste()
  }, [id, supabase])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paste.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
    </div>
  )

  if (!paste) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white/50 space-y-4">
      <Terminal className="w-12 h-12 opacity-20" />
      <h1 className="text-xl">Paste not found or private.</h1>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">{paste.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{paste.profiles?.username || 'Guest'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(paste.created_at).toLocaleDateString()}</span>
              </div>
              <div className="px-2 py-0.5 bg-accent-primary/10 text-accent-primary rounded text-[10px] font-bold uppercase tracking-widest">
                {paste.language}
              </div>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-5 py-2.5 glass glass-hover text-sm font-bold text-white rounded-xl transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-2xl blur opacity-30"></div>
          <div className="relative glass rounded-2xl overflow-hidden border border-white/5">
            <SyntaxHighlighter
              language={paste.language}
              style={atomDark}
              customStyle={{
                margin: 0,
                padding: '24px',
                background: 'transparent',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'var(--font-geist-mono)',
                }
              }}
            >
              {paste.content}
            </SyntaxHighlighter>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
