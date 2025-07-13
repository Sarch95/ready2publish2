import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

interface LoginForm {
  email: string
  password: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [searchParams] = useSearchParams()
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  useEffect(() => {
    // Check if user comes from email confirmation
    if (searchParams.get('confirmed') === 'true') {
      toast.success('E-Mail erfolgreich bestätigt! Sie können sich jetzt anmelden.')
    }
  }, [searchParams])

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      await signIn(data.email, data.password)
      toast.success('Erfolgreich angemeldet!')
      navigate('/')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Anmeldung fehlgeschlagen')
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
                Anmelden
              </h2>
              <p className="font-opensans text-gray-600 mt-2">
                Melden Sie sich bei Ihrem Konto an
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      }
                    })}
                    error={errors.password?.message}
                    placeholder="Ihr Passwort"
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

              <div className="flex items-center justify-between">
                <Link 
                  to="/forgot-password" 
                  className="font-opensans text-sm text-ready-blue hover:text-ready-blue/80"
                >
                  Passwort vergessen?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Anmeldung...' : 'Anmelden'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-opensans text-sm text-gray-600">
                Noch kein Konto?{' '}
                <Link 
                  to="/register" 
                  className="text-ready-blue hover:text-ready-blue/80 font-medium"
                >
                  Jetzt registrieren
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}