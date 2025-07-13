import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Trash2, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface CartItem {
  id: number
  title: string
  price: number
  cover_image_url: string
  author: string
  quantity?: number
}

export function CartPage() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }

  const updateCart = (items: CartItem[]) => {
    setCartItems(items)
    localStorage.setItem('cart', JSON.stringify(items))
  }

  const removeFromCart = (bookId: number) => {
    const updatedItems = cartItems.filter(item => item.id !== bookId)
    updateCart(updatedItems)
    toast.success('Artikel aus dem Warenkorb entfernt')
  }

  const clearCart = () => {
    updateCart([])
    toast.success('Warenkorb geleert')
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0)
  }

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Bitte melden Sie sich an, um fortzufahren')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Ihr Warenkorb ist leer')
      return
    }

    try {
      setLoading(true)

      // Process each item separately for now
      for (const item of cartItems) {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: {
            bookProjectId: item.id,
            amount: item.price,
            currency: 'eur'
          }
        })

        if (error) throw error
      }

      toast.success(`TEST MODUS: ${cartItems.length} Zahlungen vorbereitet!\n\nGesamtbetrag: €${getTotalPrice().toFixed(2)}\n\nVerwenden Sie Testkarten für die Zahlungen.`, {
        duration: 10000
      })

      // Clear cart after successful checkout
      clearCart()

    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error(error.message || 'Fehler beim Checkout')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-ready-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h1 className="font-poppins font-bold text-3xl text-ready-text mb-4">
                Ihr Warenkorb ist leer
              </h1>
              <p className="font-opensans text-gray-600 mb-8">
                Entdecken Sie unsere Buchprojekte und fügen Sie sie zu Ihrem Warenkorb hinzu.
              </p>
              <Link to="/shop">
                <Button size="lg">
                  Zum Shop
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ready-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-poppins font-bold text-3xl text-ready-text mb-4">
            Warenkorb
          </h1>
          <p className="font-opensans text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'Artikel' : 'Artikel'} in Ihrem Warenkorb
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        className="w-20 h-28 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-poppins font-semibold text-lg text-ready-text mb-1">
                          {item.title}
                        </h3>
                        <p className="font-opensans text-gray-600 text-sm mb-2">
                          von {item.author}
                        </p>
                        <p className="font-poppins font-bold text-ready-blue text-lg">
                          €{item.price.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    Warenkorb leeren
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Bestellübersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-opensans text-gray-600">Zwischensumme:</span>
                    <span className="font-poppins font-semibold">€{getTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-opensans text-gray-600">Bearbeitungsgebühr:</span>
                    <span className="font-poppins font-semibold">€0.00</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="font-poppins font-bold text-lg">Gesamt:</span>
                      <span className="font-poppins font-bold text-lg text-ready-blue">
                        €{getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleCheckout}
                      disabled={loading || !user}
                      className="w-full"
                      size="lg"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      {loading ? 'Wird verarbeitet...' : 'Zur Kasse'}
                    </Button>
                    
                    {!user && (
                      <p className="text-sm text-red-600 mt-2 text-center">
                        Bitte melden Sie sich an, um fortzufahren
                      </p>
                    )}
                  </div>

                  <div className="pt-4 text-center">
                    <Link to="/shop">
                      <Button variant="outline" className="w-full">
                        Weiter einkaufen
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-green-600 mb-2">
                    <CreditCard className="h-6 w-6 mx-auto" />
                  </div>
                  <p className="font-opensans text-sm text-gray-600">
                    <strong>TEST MODUS:</strong> Sichere Zahlungsverarbeitung über Stripe. 
                    Verwenden Sie Testkarten für Demonstrationszwecke.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}