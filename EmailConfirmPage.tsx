import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'

export function EmailConfirmPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        if (!token_hash || type !== 'email') {
          setStatus('error')
          setMessage('Ungültiger Bestätigungslink.')
          return
        }

        // Verify the email confirmation token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email'
        })

        if (error) {
          console.error('Email confirmation error:', error)
          setStatus('error')
          setMessage('Fehler bei der E-Mail-Bestätigung: ' + error.message)
          return
        }

        if (data.user) {
          setStatus('success')
          setMessage('E-Mail erfolgreich bestätigt! Sie werden in Kürze weitergeleitet...')
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate('/login?confirmed=true')
          }, 3000)
        } else {
          setStatus('error')
          setMessage('Bestätigung fehlgeschlagen.')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        setStatus('error')
        setMessage('Ein unerwarteter Fehler ist aufgetreten.')
      }
    }

    confirmEmail()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-ready-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <RefreshCw className="h-16 w-16 text-ready-blue mx-auto mb-4 animate-spin" />
              <h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">
                E-Mail wird bestätigt...
              </h1>
              <p className="font-opensans text-gray-600">
                Bitte warten Sie einen Moment.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">
                Bestätigung erfolgreich!
              </h1>
              <p className="font-opensans text-gray-600 mb-6">
                {message}
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Zur Anmeldung
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">
                Bestätigung fehlgeschlagen
              </h1>
              <p className="font-opensans text-gray-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Button onClick={() => window.location.reload()} className="w-full" variant="outline">
                  Erneut versuchen
                </Button>
                <Button onClick={() => navigate('/register')} className="w-full">
                  Zurück zur Registrierung
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-ready-blue hover:text-ready-blue/80"
          >
            ← Zurück zur Startseite
          </Button>
        </div>
      </div>
    </div>
  )
}
