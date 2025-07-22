import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import HealthTourismPlatformSimple from './components/HealthTourismPlatformSimple.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import PackageTest from './components/PackageTest.jsx'

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Admin login sonrası otomatik yönlendirme
  useEffect(() => {
    if (isAuthenticated && isAdmin() && location.pathname === '/') {
      navigate('/admin')
    }
  }, [isAuthenticated, isAdmin, location.pathname, navigate])

  return (
    <div>
      <Routes>
        <Route path="/" element={<HealthTourismPlatformSimple />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/test" element={<PackageTest />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
