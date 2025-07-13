import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

interface FAQ {
  id: number
  question: string
  answer: string
}

export function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>()

  useEffect(() => {
    // Load FAQs
    fetch('/data/faqs.json')
      .then(res => res.json())
      .then(data => setFaqs(data))
      .catch(error => console.error('Error loading FAQs:', error))
  }, [])

  const onSubmit = async (data: ContactForm) => {
    setLoading(true)
    try {
      // Simulate API call for contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Nachricht erfolgreich gesendet! Wir melden uns bald bei Ihnen.')
      reset()
    } catch (error) {
      toast.error('Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-Mail',
      details: 'kontakt@ready2publish.de',
      description: 'Schreiben Sie uns jederzeit'
    },
    {
      icon: Phone,
      title: 'Telefon',
      details: '+49 (0) 30 12345678',
      description: 'Mo-Fr: 9:00 - 18:00 Uhr'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: 'Unter den Linden 1\n10117 Berlin',
      description: 'Deutschland'
    }
  ]

  return (
    <div className="min-h-screen bg-ready-bg">
      {/* Header */}
      <section className="bg-gradient-to-br from-ready-blue to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-poppins font-bold text-4xl lg:text-5xl mb-6">
              Kontakt
            </h1>
            <p className="font-opensans text-xl text-blue-100 max-w-3xl mx-auto">
              Haben Sie Fragen zu Ready2Publish? Wir sind hier, um Ihnen zu helfen!
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-ready-blue/10 rounded-lg flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-ready-blue" />
                        </div>
                        <div>
                          <h3 className="font-poppins font-semibold text-lg text-ready-text mb-1">
                            {info.title}
                          </h3>
                          <p className="font-opensans text-ready-text whitespace-pre-line mb-2">
                            {info.details}
                          </p>
                          <p className="font-opensans text-sm text-gray-600">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {/* Office Hours */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-ready-orange/10 rounded-lg flex-shrink-0">
                      <Clock className="h-6 w-6 text-ready-orange" />
                    </div>
                    <div>
                      <h3 className="font-poppins font-semibold text-lg text-ready-text mb-3">
                        Support-Zeiten
                      </h3>
                      <div className="space-y-2 font-opensans text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Montag - Freitag:</span>
                          <span className="text-ready-text">9:00 - 18:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Samstag:</span>
                          <span className="text-ready-text">10:00 - 14:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sonntag:</span>
                          <span className="text-ready-text">Geschlossen</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-6 w-6 text-ready-blue" />
                    <span>Nachricht senden</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                        Name *
                      </label>
                      <Input
                        type="text"
                        {...register('name', { 
                          required: 'Name ist erforderlich',
                          minLength: {
                            value: 2,
                            message: 'Name muss mindestens 2 Zeichen lang sein'
                          }
                        })}
                        error={errors.name?.message}
                        placeholder="Ihr vollständiger Name"
                      />
                    </div>

                    <div>
                      <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                        E-Mail *
                      </label>
                      <Input
                        type="email"
                        {...register('email', { 
                          required: 'E-Mail ist erforderlich',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Ungültige E-Mail-Adresse'
                          }
                        })}
                        error={errors.email?.message}
                        placeholder="ihre.email@beispiel.de"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                      Betreff *
                    </label>
                    <Input
                      type="text"
                      {...register('subject', { 
                        required: 'Betreff ist erforderlich',
                        minLength: {
                          value: 5,
                          message: 'Betreff muss mindestens 5 Zeichen lang sein'
                        }
                      })}
                      error={errors.subject?.message}
                      placeholder="Worum geht es in Ihrer Nachricht?"
                    />
                  </div>

                  <div>
                    <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                      Nachricht *
                    </label>
                    <textarea
                      {...register('message', { 
                        required: 'Nachricht ist erforderlich',
                        minLength: {
                          value: 20,
                          message: 'Nachricht muss mindestens 20 Zeichen lang sein'
                        }
                      })}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-ready-blue focus:border-ready-blue font-opensans"
                      placeholder="Beschreiben Sie Ihr Anliegen ausführlich..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    {loading ? 'Wird gesendet...' : 'Nachricht senden'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-6 w-6 text-ready-blue" />
                  <span>Häufig gestellte Fragen</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-ready-blue focus:ring-inset"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-poppins font-semibold text-ready-text">
                          {faq.question}
                        </h3>
                        <span className="text-ready-blue">
                          {expandedFaq === faq.id ? '−' : '+'}
                        </span>
                      </div>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4">
                        <p className="font-opensans text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}