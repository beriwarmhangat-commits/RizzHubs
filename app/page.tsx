'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Terminal, Shield, Sparkles, ArrowRight, Code } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden min-h-screen bg-background">
      {/* Visual background blobs (pointer-events-none to prevent blocking clicks) */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Content */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <div className="flex">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-white/60 ring-1 ring-white/10 glass">
              Welcome to <span className="text-accent-primary font-bold">RizHub</span>
            </div>
          </div>
          
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-7xl">
            Share Code <br />
            <span className="text-gradient font-extrabold italic">Beautifully.</span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-white/60 max-w-lg">
            A modern, high-performance code sharing platform built for developers. 
            Create, share, and manage snippets with premium glassmorphism UI.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/create"
              className="rounded-xl bg-accent-primary px-8 py-4 text-sm font-bold text-black shadow-lg hover:shadow-accent-primary/20 transition-all flex items-center gap-2 group"
            >
              <Code className="w-5 h-5" />
              <span>Create New Paste</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link href="/auth/register" className="text-sm font-semibold leading-6 text-white hover:text-accent-primary transition-colors flex items-center gap-2">
              Sign up free
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-16 flex items-center gap-4 py-4 px-6 glass w-fit rounded-2xl border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Operational</span>
          </div>
        </div>

        {/* Floating cards for design */}
        <div className="hidden lg:block relative mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow scale-110">
           <div className="glass p-8 rounded-3xl border-white/10 w-96 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex gap-2 mb-4">
                 <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
                <div className="h-4 bg-white/5 rounded-full w-full"></div>
                <div className="h-4 bg-white/5 rounded-full w-1/2"></div>
                <div className="h-24 bg-accent-primary/5 rounded-2xl w-full flex items-center justify-center">
                  <Terminal className="w-12 h-12 text-accent-primary/20" />
                </div>
              </div>
           </div>
           
           <div className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl border-white/10 w-48 -rotate-6 shadow-2xl backdrop-blur-3xl">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-accent-secondary/10 rounded-lg">
                    <Shield className="w-5 h-5 text-accent-secondary" />
                 </div>
                 <span className="text-xs font-bold text-white">Secure RLS</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
