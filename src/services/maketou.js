// 🌍 Service MAKETOU - Gestion des abonnements récurrents (B2C)
// À adapter avec les endpoints réels de l'API MAKETOU ou CinetPay/Fedapay

const MAKETOU_API_BASE = import.meta.env.VITE_MAKETOU_API_BASE || 'https://api.maketou.com/v1'
const MAKETOU_API_KEY = import.meta.env.VITE_MAKETOU_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${MAKETOU_API_KEY}`,
  'X-Client-Id': 'gardikont-client'
}

/**
 * Crée ou met à jour un abonnement pour un client
 */
export const createSubscription = async (email, plan, paymentMethod) => {
  try {
    const res = await fetch(`${MAKETOU_API_BASE}/subscriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer_email: email,
        plan_id: `gardikont_${plan}`,
        payment_method: paymentMethod,
        trial_days: plan === 'free' ? 14 : 0
      })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
    return await res.json()
  } catch (err) {
    console.error('MAKETOU Error:', err)
    throw err
  }
}

/**
 * Vérifie le statut d'un abonnement
 */
export const getSubscriptionStatus = async (subscriptionId) => {
  try {
    const res = await fetch(`${MAKETOU_API_BASE}/subscriptions/${subscriptionId}`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('MAKETOU Status Error:', err)
    return { status: 'unknown' }
  }
}

/**
 * Handler pour les webhooks MAKETOU (à appeler depuis ton backend/serverless)
 */
export const handleWebhook = async (event) => {
  const { type, data } = event
  switch (type) {
    case 'subscription.created':
      console.log('✅ Nouvel abonnement:', data.customer_email)
      break
    case 'payment.succeeded':
      console.log('💰 Paiement réussi pour:', data.subscription_id)
      break
    case 'payment.failed':
      console.log('❌ Paiement échoué. Relance automatique dans 3 jours...')
      break
    case 'subscription.cancelled':
      console.log('🚫 Abonnement annulé:', data.customer_email)
      break
    default:
      console.warn('⚠️ Webhook MAKETOU inconnu:', type)
  }
  return { received: true }
}