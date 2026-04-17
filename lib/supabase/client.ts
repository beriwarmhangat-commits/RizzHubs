import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('replace_with')) {
    console.error('Supabase credentials missing or invalid in .env.local')
  }

  return createBrowserClient(
    supabaseUrl || '',
    supabaseKey || ''
  )
}

