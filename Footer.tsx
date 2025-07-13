import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-ready-text text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-ready-orange" />
              <span className="font-poppins font-bold text-xl">
                Ready2Publish
              </span>
            </div>
            <p className="font-opensans text-gray-300 mb-4">
              Der digitale Marktplatz für fertige Buchprojekte. Hier treffen professionelle Autoren auf Verlage und Selfpublisher, die Qualität schätzen.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-ready-orange transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-ready-orange transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-ready-orange transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 font-opensans">
              <li>
                <Link to="/" className="text-gray-300 hover:text-ready-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-ready-orange transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-ready-orange transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-ready-orange transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-ready-orange transition-colors">
                  Autor werden
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Rechtliches</h3>
            <ul className="space-y-2 font-opensans">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-ready-orange transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-ready-orange transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link to="/imprint" className="text-gray-300 hover:text-ready-orange transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-ready-orange transition-colors">
                  Hilfe
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-600 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 font-opensans">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-ready-orange" />
              <span>kontakt@ready2publish.de</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-ready-orange" />
              <span>+49 (0) 30 12345678</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-ready-orange" />
              <span>Berlin, Deutschland</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300 font-opensans text-sm">
            © 2024 Ready2Publish. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}