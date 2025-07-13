import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { ArrowRight, Clock, Star, Download, Users, BookOpen, TrendingUp } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  text: string
  rating: number
  avatar_url: string
}

export function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    // Load testimonials
    fetch('/data/testimonials.json')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(error => console.error('Error loading testimonials:', error))
  }, [])

  const features = [
    {
      icon: Clock,
      title: 'Zeitsparend',
      description: 'Fertige Buchprojekte kaufen statt monatelang entwickeln. Sofort startbereit für die Veröffentlichung.',
      image: '/images/icon-time.jpg'
    },
    {
      icon: Star,
      title: 'Professionell',
      description: 'Alle Projekte durchlaufen eine Qualitätsprüfung. Nur hochwertige Inhalte mit professioneller Aufmachung.',
      image: '/images/icon-quality.jpg'
    },
    {
      icon: Download,
      title: 'Sofort einsetzbar',
      description: 'Cover, Manuskript und alle Rechte inklusive. Nach dem Kauf sofortiger Download aller Dateien.',
      image: '/images/icon-instant.jpg'
    }
  ]

  const stats = [
    { label: 'Buchprojekte', value: '500+', icon: BookOpen },
    { label: 'Zufriedene Kunden', value: '1.200+', icon: Users },
    { label: 'Erfolgsrate', value: '98%', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-ready-bg">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ready-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-poppins font-bold text-4xl lg:text-6xl mb-6 leading-tight">
                Der Marktplatz für
                <span className="text-ready-orange block">
                  fertige Buchprojekte
                </span>
              </h1>
              <p className="font-opensans text-xl text-blue-100 mb-8 leading-relaxed">
                Entdecken Sie professionelle Buchprojekte von erfahrenen Autoren. 
                Komplett mit Cover, Inhalt und Rechten - sofort bereit für die Veröffentlichung.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button size="lg" className="bg-ready-orange hover:bg-ready-orange/90 font-semibold">
                    Jetzt Projekte entdecken
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-ready-blue">
                    Als Autor starten
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/hero-illustration.jpg"
                alt="Buchmarktplatz Illustration"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-ready-orange rounded-lg p-4 shadow-xl">
                <div className="text-white">
                  <div className="font-poppins font-bold text-2xl">500+</div>
                  <div className="font-opensans text-sm">Buchprojekte verfügbar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-ready-blue/10 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-ready-blue" />
                  </div>
                  <div className="font-poppins font-bold text-4xl text-ready-text mb-2">
                    {stat.value}
                  </div>
                  <div className="font-opensans text-gray-600">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-ready-text mb-4">
              Warum Ready2Publish?
            </h2>
            <p className="font-opensans text-xl text-gray-600 max-w-3xl mx-auto">
              Sparen Sie Zeit und Ressourcen mit unseren professionellen Buchprojekten
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-ready-blue/10 rounded-full mb-6">
                      <IconComponent className="h-10 w-10 text-ready-blue" />
                    </div>
                    <h3 className="font-poppins font-semibold text-xl text-ready-text mb-4">
                      {feature.title}
                    </h3>
                    <p className="font-opensans text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Books Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-ready-text mb-4">
              Beliebte Buchprojekte
            </h2>
            <p className="font-opensans text-xl text-gray-600">
              Entdecken Sie unsere meistverkauften Projekte
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <img
                    src={`/images/book-cover-${index}.jpg`}
                    alt={`Buchcover ${index}`}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-ready-orange font-semibold">Fantasy</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                    </div>
                    <h3 className="font-poppins font-semibold text-lg text-ready-text mb-2">
                      Die Kristalle von Eldoria
                    </h3>
                    <p className="font-opensans text-gray-600 text-sm mb-4">
                      Ein episches Fantasy-Abenteuer...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-poppins font-bold text-xl text-ready-blue">
                        €299.99
                      </span>
                      <Button size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/shop">
              <Button size="lg">
                Alle Projekte ansehen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-ready-text mb-4">
              Was unsere Kunden sagen
            </h2>
            <p className="font-opensans text-xl text-gray-600">
              Erfahrungen von Verlagen, Selfpublishern und Autoren
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="font-opensans text-gray-600 mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-poppins font-semibold text-ready-text">
                        {testimonial.name}
                      </div>
                      <div className="font-opensans text-sm text-gray-600">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-ready-blue to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl mb-6">
            Bereit für Ihr nächstes Buchprojekt?
          </h2>
          <p className="font-opensans text-xl text-blue-100 mb-8">
            Entdecken Sie professionelle Buchprojekte oder verkaufen Sie Ihre eigenen Werke an eine qualifizierte Zielgruppe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="bg-ready-orange hover:bg-ready-orange/90">
                Projekte durchstöbern
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-ready-blue">
                Als Autor registrieren
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}