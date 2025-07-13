import React from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Target, Eye, Users, BookOpen, Star, TrendingUp, Award, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Qualität steht an erster Stelle',
      description: 'Alle Buchprojekte durchlaufen eine strenge Qualitätsprüfung, um sicherzustellen, dass nur professionelle Inhalte angeboten werden.'
    },
    {
      icon: Heart,
      title: 'Vertrauen und Transparenz',
      description: 'Klare Lizenzbedingungen, faire Provisionen und transparente Prozesse schaffen Vertrauen zwischen Autoren und Käufern.'
    },
    {
      icon: Users,
      title: 'Community im Fokus',
      description: 'Wir bringen Autoren, Verlage und Selfpublisher zusammen und schaffen eine lebendige Gemeinschaft rund um das Publizieren.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation und Fortschritt',
      description: 'Wir entwickeln ständig neue Features und Lösungen, um den Buchmarkt effizienter und zugnänglicher zu machen.'
    }
  ]

  const team = [
    {
      name: 'Sarah Müller',
      role: 'Gründerin & CEO',
      bio: 'Ehemalige Verlagsleiterin mit 15 Jahren Erfahrung in der Buchbranche. Vision: Den Buchmarkt zu revolutionieren.',
      image: '/images/author-2.jpg'
    },
    {
      name: 'Thomas Weber',
      role: 'CTO & Mitgründer',
      bio: 'Tech-Experte mit Fokus auf E-Commerce und digitale Marktplätze. Entwickelt unsere innovative Plattform.',
      image: '/images/author-1.jpg'
    },
    {
      name: 'Lisa Schmidt',
      role: 'Content Director',
      bio: 'Bestseller-Autorin und Expertin für Qualitätskontrolle. Stellt sicher, dass nur erstklassige Inhalte angeboten werden.',
      image: '/images/author-3.jpg'
    }
  ]

  const stats = [
    { icon: BookOpen, value: '500+', label: 'Buchprojekte', color: 'text-ready-blue' },
    { icon: Users, value: '1.200+', label: 'Aktive Nutzer', color: 'text-ready-orange' },
    { icon: Star, value: '4.9/5', label: 'Zufriedenheit', color: 'text-yellow-500' },
    { icon: Award, value: '98%', label: 'Erfolgsrate', color: 'text-green-500' }
  ]

  return (
    <div className="min-h-screen bg-ready-bg">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ready-blue to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-poppins font-bold text-4xl lg:text-5xl mb-6">
              Über Ready2Publish
            </h1>
            <p className="font-opensans text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Wir verbinden professionelle Autoren mit Verlagen und Selfpublishern 
              und revolutionieren dabei den traditionellen Buchmarkt.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4`}>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="font-poppins font-bold text-3xl text-ready-text mb-2">
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

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-poppins font-bold text-3xl text-ready-text mb-6">
                Unsere Mission
              </h2>
              <p className="font-opensans text-gray-700 text-lg leading-relaxed mb-6">
                Ready2Publish wurde gegründet, um den oft komplexen und zeitaufwendigen Prozess 
                der Buchbeschaffung zu revolutionieren. Wir glauben, dass qualitativ hochwertige 
                Buchprojekte schnell und effizient ihren Weg zu den richtigen Verlagen und 
                Selfpublishern finden sollten.
              </p>
              <p className="font-opensans text-gray-700 text-lg leading-relaxed">
                Gleichzeitig bieten wir professionellen Autoren eine Plattform, um ihre fertigen 
                Werke einer qualifizierten Zielgruppe zu präsentieren und faire Vergütungen 
                für ihre kreative Arbeit zu erhalten.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/images/books-stack.jpg" 
                alt="Stapel von Büchern" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-ready-orange rounded-lg p-4 shadow-xl">
                <div className="text-white text-center">
                  <div className="font-poppins font-bold text-2xl">3 Jahre</div>
                  <div className="font-opensans text-sm">Markterfahrung</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="/images/hero-illustration.jpg" 
                alt="Zukunft des Publishings" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-poppins font-bold text-3xl text-ready-text mb-6">
                Unsere Vision
              </h2>
              <p className="font-opensans text-gray-700 text-lg leading-relaxed mb-6">
                Wir envisionieren eine Zukunft, in der der Buchmarkt vollständig digitalisiert 
                und demokratisiert ist. Jeder Autor soll die Möglichkeit haben, seine Werke 
                einem globalen Publikum zu präsentieren, und jeder Verleger soll Zugang zu 
                den besten verfügbaren Inhalten haben.
              </p>
              <p className="font-opensans text-gray-700 text-lg leading-relaxed">
                Ready2Publish soll der führende Marktplatz für fertige Buchprojekte werden 
                und dabei höchste Qualitätsstandards und faire Bedingungen für alle Beteiligten 
                gewährleisten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-ready-text mb-4">
              Unsere Werte
            </h2>
            <p className="font-opensans text-xl text-gray-600 max-w-3xl mx-auto">
              Diese Prinzipien leiten uns in allem, was wir tun
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-ready-blue/10 rounded-lg flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-ready-blue" />
                      </div>
                      <div>
                        <h3 className="font-poppins font-semibold text-xl text-ready-text mb-3">
                          {value.title}
                        </h3>
                        <p className="font-opensans text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-ready-text mb-4">
              Unser Team
            </h2>
            <p className="font-opensans text-xl text-gray-600">
              Die Menschen hinter Ready2Publish
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="font-poppins font-semibold text-xl text-ready-text mb-2">
                    {member.name}
                  </h3>
                  <p className="font-opensans text-ready-orange font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="font-opensans text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-ready-text mb-4">
              Warum Ready2Publish?
            </h2>
            <p className="font-opensans text-xl text-gray-600 max-w-3xl mx-auto">
              Entdecken Sie die Vorteile unserer Plattform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-ready-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-lg mb-2">Für Autoren</h3>
                    <p className="font-opensans text-gray-600">Verkaufen Sie Ihre fertigen Buchprojekte an eine qualifizierte Zielgruppe und erhalten Sie faire Vergütungen für Ihre Arbeit.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-ready-orange rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-lg mb-2">Für Verlage</h3>
                    <p className="font-opensans text-gray-600">Entdecken Sie fertige, professionelle Buchprojekte und sparen Sie Zeit und Ressourcen bei der Inhaltsbeschaffung.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-lg mb-2">Für Selfpublisher</h3>
                    <p className="font-opensans text-gray-600">Finden Sie sofort einsetzbare Buchprojekte mit allen benötigten Materialien und starten Sie direkt mit der Veröffentlichung.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="bg-gradient-to-br from-ready-blue to-blue-700 text-white">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-6 text-blue-200" />
                  <h3 className="font-poppins font-bold text-2xl mb-4">
                    Bereit loszulegen?
                  </h3>
                  <p className="font-opensans text-blue-100 mb-6">
                    Werden Sie Teil unserer wachsenden Community und entdecken Sie die Zukunft des Buchmarkts.
                  </p>
                  <div className="space-y-3">
                    <Link to="/register">
                      <Button className="w-full bg-ready-orange hover:bg-ready-orange/90">
                        Jetzt registrieren
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-ready-blue">
                        Kontakt aufnehmen
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}