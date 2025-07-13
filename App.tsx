import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { BookDetailPage } from './pages/BookDetailPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { EmailConfirmPage } from './pages/EmailConfirmPage'
import { AuthorDashboard } from './pages/AuthorDashboard'
import { CartPage } from './pages/CartPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-ready-bg">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/book/:id" element={<BookDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/email-confirm" element={<EmailConfirmPage />} />
                {/* Placeholder routes for future implementation */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<div className="min-h-screen bg-ready-bg flex items-center justify-center"><div className="text-center"><h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">Profil</h1><p className="font-opensans text-gray-600">Diese Seite wird bald verfügbar sein!</p></div></div>} />
                <Route path="/author/dashboard" element={<AuthorDashboard />} />
                <Route path="/buyer/dashboard" element={<div className="min-h-screen bg-ready-bg flex items-center justify-center"><div className="text-center"><h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">Käufer Dashboard</h1><p className="font-opensans text-gray-600">Diese Seite wird bald verfügbar sein!</p></div></div>} />
                <Route path="/privacy" element={<div className="min-h-screen bg-ready-bg flex items-center justify-center"><div className="text-center"><h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">Datenschutz</h1><p className="font-opensans text-gray-600">Diese Seite wird bald verfügbar sein!</p></div></div>} />
                <Route path="/terms" element={<div className="min-h-screen bg-ready-bg flex items-center justify-center"><div className="text-center"><h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">AGB</h1><p className="font-opensans text-gray-600">Diese Seite wird bald verfügbar sein!</p></div></div>} />
                <Route path="/imprint" element={<div className="min-h-screen bg-ready-bg flex items-center justify-center"><div className="text-center"><h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">Impressum</h1><p className="font-opensans text-gray-600">Diese Seite wird bald verfügbar sein!</p></div></div>} />
                <Route path="/help" element={<div className="min-h-screen bg-ready-bg flex items-center justify-center"><div className="text-center"><h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">Hilfe</h1><p className="font-opensans text-gray-600">Diese Seite wird bald verfügbar sein!</p></div></div>} />
                {/* 404 Route */}
                <Route path="*" element={<div className="min-h-screen bg-ready-bg flex items-center justify-center"><div className="text-center"><h1 className="font-poppins font-bold text-3xl text-ready-text mb-4">404 - Seite nicht gefunden</h1><p className="font-opensans text-gray-600 mb-6">Die angeforderte Seite konnte nicht gefunden werden.</p><a href="/" className="text-ready-blue hover:text-ready-blue/80 font-medium">Zurück zur Startseite</a></div></div>} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" richColors />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App