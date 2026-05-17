import { useParams, useNavigate } from 'react-router-dom'

export default function Validation() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Données mockées pour le test (à remplacer par Supabase plus tard)
  const service = {
    sites: { name: 'Site Test', address: 'Lomé, Togo', security_company: 'Sécurité Plus' },
    date: '2026-05-20',
    start_time: '08:00',
    end_time: '18:00',
    duration_hours: 10
  }

  const handleValidate = (status) => {
    alert(`✅ Service ${status === 'validated' ? 'validé' : 'contesté'} !\n(ID: ${id})`)
    navigate('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Validation du service</h1>
      
      <div className="bg-white rounded-lg shadow p-4 md:p-6 space-y-3 text-sm">
        <div><strong>Société :</strong> {service.sites?.security_company}</div>
        <div><strong>Site :</strong> {service.sites?.name} <span className="text-gray-500">({service.sites?.address})</span></div>
        <div><strong>Date :</strong> {service.date}</div>
        <div><strong>Horaires :</strong> {service.start_time} - {service.end_time} ({service.duration_hours}h)</div>
      </div>

      <div className="mt-6 space-y-3">
        <button 
          onClick={() => handleValidate('validated')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg"
        >
          ✅ Je confirme : le service a été effectué
        </button>
        <button 
          onClick={() => handleValidate('contested')}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg"
        >
          ⚠️ Signaler un problème
        </button>
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
        >
          ← Retour au tableau de bord
        </button>
      </div>
    </div>
  )
}