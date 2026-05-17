import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const QUEUE_KEY = 'gardikont_offline_queue'

// Initialiser IndexedDB (simple key-value pour la queue)
const db = {
  get: () => JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'),
  set: (items) => localStorage.setItem(QUEUE_KEY, JSON.stringify(items)),
  add: (item) => {
    const items = db.get()
    items.push({ ...item, id: crypto.randomUUID(), createdAt: Date.now() })
    db.set(items)
  },
  remove: (id) => {
    const items = db.get().filter(i => i.id !== id)
    db.set(items)
  }
}

export const useOfflineQueue = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [queueLength, setQueueLength] = useState(db.get().length)

  useEffect(() => {
    const onOnline = () => { setIsOnline(true); syncQueue() }
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  // Ajouter une validation à la queue (si hors ligne)
  const enqueueValidation = async (validationData) => {
    if (isOnline) {
      // Envoyer directement
      const { error } = await supabase.from('validations').insert(validationData)
      if (error) throw error
    } else {
      // Stocker en local pour plus tard
      db.add({ type: 'validation', data: validationData })
      setQueueLength(db.get().length)
    }
  }

  // Synchroniser la queue quand on revient en ligne
  const syncQueue = async () => {
    const items = db.get()
    if (items.length === 0) return

    for (const item of items) {
      if (item.type === 'validation') {
        try {
          const { error } = await supabase.from('validations').insert(item.data)
          if (!error) db.remove(item.id)
        } catch (e) {
          console.warn('Sync failed, will retry later', e)
        }
      }
    }
    setQueueLength(db.get().length)
  }

  // Sync automatique au montage + toutes les 30s si en ligne
  useEffect(() => {
    if (isOnline) {
      syncQueue()
      const interval = setInterval(syncQueue, 30000)
      return () => clearInterval(interval)
    }
  }, [isOnline])

  return { isOnline, queueLength, enqueueValidation, syncQueue }
}