import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { generateValidationPDF } from '../utils/pdfGenerator'
import { getCurrentSession } from '../services/auth'
import { FileText, Filter, Download, Eye, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // En prod : ajouter .eq('client_id', session.user.id) pour RLS
        const { data, error } = await supabase
          .from('services')
          .select(`
            id,
            date,
            start_time,
            end_time,
            duration_hours,
            status,
            sites ( name, security_company )
          `)
          .order('date', { ascending: false })
        
        if (error) throw error
        setServices(data || [])
      } catch (err) {
        console.error('Erreur fetch:', err)
        // Fallback dev si RLS bloque temporairement
        setServices([
          { id: 'mock-1', date: '2026-05-20', start_time: '08:00', end_time: '18:00', duration_hours: 10, status: 'pending', sites: { name: 'Site Lomé', security_company: 'Sécurité Plus' } }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const filteredServices = services.filter(s => filter === 'all' || s.status === filter)

  const handleExportPDF = async (service) => {
    try {
      const blob = await generateValidationPDF(
        { status: 'validated', validated_at: new Date().toISOString(), sha256_hash: 'hash-' + Date.now() },
        service,
        service.sites,
        { email: 'client@gardikont.app', company_name: 'Client Test' }
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Validation_GardiKont_${service.date}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Erreur lors de la génération du PDF.')
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'validated': return <CheckCircle className="text-green-500 w-4 h-4"/>
      case 'contested': return <AlertCircle className="text-red-500 w-4 h-4"/>
      default: return <Clock className="text-yellow-500 w-4 h-4"/>
    }
  }

  if (loading) return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600"/></div>

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
        <div className="flex gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="validated">Validés</option>
            <option value="contested">Contestés</option>
          </select>
          <button onClick={() => navigate('/validate/mock-id')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + Nouveau service
          </button>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-500">Aucun service trouvé.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-4 py-3">Site / Société</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Horaires</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredServices.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{s.sites?.name}<span className="text-gray-400 block text-xs">{s.sites?.security_company}</span></td>
                  <td className="px-4 py-3">{new Date(s.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3 text-gray-600">{s.start_time} - {s.end_time} <span className="text-xs">({s.duration_hours}h)</span></td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {getStatusIcon(s.status)}
                    <span className="capitalize">{s.status === 'pending' ? 'En attente' : s.status === 'validated' ? 'Validé' : 'Contesté'}</span>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    {s.status === 'pending' && (
                      <button onClick={() => navigate(`/validate/${s.id}`)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs font-medium">
                        Valider
                      </button>
                    )}
                    <button onClick={() => handleExportPDF(s)} className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <Download className="w-3 h-3"/> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}