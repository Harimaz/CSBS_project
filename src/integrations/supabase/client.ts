// Supabase client has been replaced with MongoDB backend
// This file is kept for compatibility but exports dummy objects

// Dummy supabase object to prevent import errors
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error('Use MongoDB backend instead') }),
    signUp: async () => ({ data: null, error: new Error('Use MongoDB backend instead') }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
    eq: () => ({ data: null, error: null }),
    maybeSingle: () => ({ data: null, error: null })
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  },
  functions: {
    invoke: async () => ({ data: null, error: null })
  }
};

// Note: This project now uses MongoDB backend
// See src/api/client.ts for the new API client