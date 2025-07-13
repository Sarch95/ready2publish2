import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { BookOpen, Eye, EyeOff, User, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  user_type: 'author' | 'buyer'
  acceptTerms: boolean
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
    defaultValues: {
      user_type: 'buyer'
    }
  })

  const password = watch('password')
  const userType = watch('user_type')

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwörter stimmen nicht überein')
      return
    }

    setLoading(true)
    try {
      await signUp(data.email, data.password, {
        full_name: data.full_name,
        user_type: data.user_type
      })
      
      toast.success('Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse.')
      navigate('/login')
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registrierung fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ready-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <BookOpen className="h-10 w-10 text-ready-blue" />
            <span className="font-poppins font-bold text-2xl text-ready-text">
              Ready2Publish
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <h2 className="font-poppins font-bold text-2xl text-ready-text">
                Registrieren
              </h2>
              <p className="font-opensans text-gray-600 mt-2">
                Erstellen Sie Ihr Ready2Publish Konto
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* User Type Selection */}
              <div>
                <label className="block font-opensans font-medium text-sm text-gray-700 mb-3">
                  Ich möchte mich registrieren als:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                    userType === 'buyer' 
                      ? 'border-ready-blue bg-ready-blue/5' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      {...register('user_type', { required: 'Bitte wählen Sie einen Kontotyp' })}
                      value="buyer"
                      className="sr-only"
                    />
                    <Users className="h-8 w-8 mx-auto mb-2 text-ready-blue" />
                    <div className="font-opensans font-medium text-sm">Käufer</div>
                    <div className="font-opensans text-xs text-gray-600">Verlage & Selfpublisher</div>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                    userType === 'author' 
                      ? 'border-ready-blue bg-ready-blue/5' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      {...register('user_type', { required: 'Bitte wählen Sie einen Kontotyp' })}
                      value="author"
                      className="sr-only"
                    />
                    <User className="h-8 w-8 mx-auto mb-2 text-ready-orange" />
                    <div className="font-opensans font-medium text-sm">Autor</div>
                    <div className="font-opensans text-xs text-gray-600">Buchprojekte verkaufen</div>
                  </label>
                </div>
                {errors.user_type && (
                  <p className="mt-1 text-sm text-red-500">{errors.user_type.message}</p>
                )}
              </div>

              <div>
                <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                  Vollständiger Name
                </label>
                <Input
                  type="text"
                  {...register('full_name', { 
                    required: 'Name ist erforderlich',
                    minLength: {
                      value: 2,
                      message: 'Name muss mindestens 2 Zeichen lang sein'
                    }
                  })}
                  error={errors.full_name?.message}
                  placeholder="Ihr vollständiger Name"
                />
              </div>

              <div>
                <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                  E-Mail-Adresse
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

              <div>
                <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                  Passwort
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { 
                      required: 'Passwort ist erforderlich',
                      minLength: {
                        value: 6,
                        message: 'Passwort muss mindestens 6 Zeichen lang sein'
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                        message: 'Passwort muss Groß- und Kleinbuchstaben sowie eine Zahl enthalten'
                      }
                    })}
                    error={errors.password?.message}
                    placeholder="Sicheres Passwort erstellen"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                  Passwort bestätigen
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', { 
                      required: 'Passwort-Bestätigung ist erforderlich',
                      validate: (value) => value === password || 'Passwörter stimmen nicht überein'
                    })}
                    error={errors.confirmPassword?.message}
                    placeholder="Passwort wiederholen"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  {...register('acceptTerms', { required: 'Bitte akzeptieren Sie die Nutzungsbedingungen' })}
                  className="mt-1 h-4 w-4 text-ready-blue border-gray-300 rounded focus:ring-ready-blue"
                />
                <label className="ml-2 font-opensans text-sm text-gray-600">
                  Ich akzeptiere die{' '}
                  <Link to="/terms" className="text-ready-blue hover:text-ready-blue/80">
                    Nutzungsbedingungen
                  </Link>
                  {' '}und{' '}
                  <Link to="/privacy" className="text-ready-blue hover:text-ready-blue/80">
                    Datenschutzerklärung
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Registrierung...' : 'Konto erstellen'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-opensans text-sm text-gray-600">
                Bereits ein Konto?{' '}
                <Link 
                  to="/login" 
                  className="text-ready-blue hover:text-ready-blue/80 font-medium"
                >
                  Jetzt anmelden
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}