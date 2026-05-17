import { supabase } from '../supabaseClient'

// Inscription avec email + téléphone optionnel
export const signUp = async (email, password, phone = '') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { phone, role: 'client' } }
  })
  if (error) throw error
  return data
}

// Connexion
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// Déconnexion
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Récupérer la session actuelle
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Écouter les changements d'auth (pour mise à jour UI en temps réel)
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}

// Générer un hash SHA-256 pour la preuve (horodatage + données)
export const generateProofHash = async (data) => {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(JSON.stringify(data))
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}