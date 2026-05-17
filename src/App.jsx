import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Validation from './pages/Validation'
import Reports from './pages/Reports'
import Test from './pages/Test'

// Protection de route simple (à améliorer avec auth state réel plus tard)
const ProtectedRoute = ({ children }) => {
  // Pour le dev, on laisse passer. En prod, vérifier session ici.
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/validate/:id" element={<ProtectedRoute><Validation /></ProtectedRoute>} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}