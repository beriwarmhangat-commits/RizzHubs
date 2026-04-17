import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  const isValid = supabaseUrl && supabaseKey && 
                  !supabaseUrl.includes('placeholder') && 
                  supabaseUrl.startsWith('http')

  if (!isValid) {
    console.error('[Supabase] Invalid credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }

  return {
    auth: {
      signInWithPassword: async () => ({ 
        error: !isValid ? { message: 'Supabase not configured. Please contact administrator.' } : null,
        data: null 
      }),
      signUp: async () => ({ 
        error: !isValid ? { message: 'Supabase not configured. Please contact administrator.' } : null,
        data: null 
      }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ 
        error: !isValid ? { message: 'Not authenticated' } : null,
        data: { user: null } 
      }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      delete: () => ({ eq: () => ({ error: null }) }),
    }),
    _isMock: !isValid,
    _realClient: isValid ? createBrowserClient(supabaseUrl, supabaseKey) : null
  } as any
}

