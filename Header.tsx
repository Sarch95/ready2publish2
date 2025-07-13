import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Menu, X, User, BookOpen, ShoppingCart, LogOut } from 'lucide-react'

export function Header() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Über uns', href: '/about' },
    { name: 'Kontakt', href: '/contact' }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-ready-blue" />
            <span className="font-poppins font-bold text-xl text-ready-text">
              Ready2Publish
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-ready-text hover:text-ready-blue transition-colors font-opensans ${
                  location.pathname === item.href ? 'text-ready-blue font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && profile ? (
              <div className="flex items-center space-x-4">
                <Link to="/cart" className="text-ready-text hover:text-ready-blue">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-ready-text hover:text-ready-blue">
                    <User className="h-5 w-5" />
                    <span className="font-opensans text-sm">{profile.full_name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to={profile.user_type === 'author' ? '/author/dashboard' : '/buyer/dashboard'}
                      className="block px-4 py-2 text-sm text-ready-text hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-ready-text hover:bg-gray-100"
                    >
                      Profil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-ready-text hover:bg-gray-100"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Abmelden
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Anmelden
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Registrieren
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-ready-text hover:text-ready-blue"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 text-ready-text hover:text-ready-blue transition-colors font-opensans ${
                  location.pathname === item.href ? 'text-ready-blue font-semibold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user && profile ? (
              <div className="border-t pt-3 mt-3">
                <div className="px-3 py-2 text-sm text-ready-text font-semibold">
                  {profile.full_name}
                </div>
                <Link
                  to={profile.user_type === 'author' ? '/author/dashboard' : '/buyer/dashboard'}
                  className="block px-3 py-2 text-ready-text hover:text-ready-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-ready-text hover:text-ready-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profil
                </Link>
                <Link
                  to="/cart"
                  className="block px-3 py-2 text-ready-text hover:text-ready-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Warenkorb
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-ready-text hover:text-ready-blue"
                >
                  Abmelden
                </button>
              </div>
            ) : (
              <div className="border-t pt-3 mt-3 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-ready-text hover:text-ready-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Anmelden
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-ready-text hover:text-ready-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrieren
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}