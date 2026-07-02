import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://zojnseizknlhvsecujag.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Hpuui2ma4NMAUZYrPb1wrA_40c3HtYC'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

window.SupabaseAuth = {
  async signUp(email, password, options) {
    const { data, error } = await supabase.auth.signUp({ email, password, options })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) return null
    return data.user
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) return null
    return data?.session || null
  }
}
