'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Terminal, Plus, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-accent-primary/10 rounded-lg group-hover:bg-accent-primary/20 transition-colors">
            <Terminal className="w-6 h-6 text-accent-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Riz<span className="text-accent-primary">Hub</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/create" className="flex items-center gap-2 px-4 py-2 rounded-full glass glass-hover text-sm font-medium text-white">
            <Plus className="w-4 h-4" />
            <span>New Paste</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 text-white/70 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <button 
                onClick={handleSignOut}
                className="p-2 text-white/70 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
