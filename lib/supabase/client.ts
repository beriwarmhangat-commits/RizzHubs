import { createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // For SSR/build time, return a mock
  if (typeof window === 'undefined') {
    return createMockClient()
  }

  // Browser: use real client
  if (!clientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[Supabase] Missing credentials in browser')
      return createMockClient()
    }

    clientInstance = createBrowserClient(supabaseUrl, supabaseKey)
  }

  return clientInstance
}

function createMockClient() {
  return {
    auth: {
      signInWithPassword: async () => ({ 
        error: { message: 'Supabase not configured. Please contact administrator.' },
        data: null 
      }),
      signUp: async () => ({ 
        error: { message: 'Supabase not configured. Please contact administrator.' },
        data: null 
      }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ 
        error: { message: 'Not authenticated' },
        data: { user: null } 
      }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      delete: () => ({ eq: () => ({ error: null }) }),
    }),
  } as any
}

