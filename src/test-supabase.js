import { supabase } from './supabaseClient'

export const testConnection = async () => {
  try {
    console.log('🔌 Tentative de connexion à Supabase...')
    const { data, error } = await supabase.from('services').select('id').limit(1)
    if (error) {
      console.error('❌ Erreur Supabase:', error.message)
      return false
    }
    console.log('✅ Supabase connecté ! Services trouvés:', data?.length || 0)
    return true
  } catch (e) {
    console.error('❌ Exception:', e)
    return false
  }
}