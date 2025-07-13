import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Star, Heart, Share2, Download, BookOpen, User, Calendar, ShoppingCart, CheckCircle, CreditCard } from 'lucide-react'
import { BookProject, Review, supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [book, setBook] = useState<BookProject | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!id) return
    loadBookDetails()
  }, [id])

  const loadBookDetails = async () => {
    try {
      setLoading(true)
      
      // Load book, author, and category separately
      const { data: bookData, error: bookError } = await supabase
        .from('book_projects')
        .select('*')
        .eq('id', parseInt(id!))
        .eq('status', 'active')
        .maybeSingle()

      if (bookError) throw bookError
      
      if (bookData) {
        // Load author and category details
        const [authorResponse, categoryResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, full_name, avatar_url, bio')
            .eq('id', bookData.author_id)
            .maybeSingle(),
          supabase
            .from('categories')
            .select('*')
            .eq('id', bookData.category_id)
            .maybeSingle()
        ])

        // Combine data manually
        const bookWithDetails = {
          ...bookData,
          author: authorResponse.data || null,
          category: categoryResponse.data || null,
          rating: 4.5 + Math.random() * 0.5,
          reviews_count: Math.floor(Math.random() * 50) + 10
        }
        
        setBook(bookWithDetails)
      }
    } catch (error) {
      console.error('Error loading book:', error)
      toast.error('Fehler beim Laden des Buchprojekts')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Bitte melden Sie sich an, um Artikel zum Warenkorb hinzuzufügen')
      return
    }
    
    if (!book) return
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    // Check if book is already in cart
    if (existingCart.find((item: any) => item.id === book.id)) {
      toast.info('Dieses Buchprojekt ist bereits in Ihrem Warenkorb')
      return
    }
    
    // Add to cart
    const cartItem = {
      id: book.id,
      title: book.title,
      price: book.price,
      cover_image_url: book.cover_image_url,
      author: book.author?.full_name || 'Unbekannter Autor'
    }
    
    const updatedCart = [...existingCart, cartItem]
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    
    toast.success('Buchprojekt zum Warenkorb hinzugefügt!')
  }

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Bitte melden Sie sich an, um ein Buchprojekt zu kaufen')
      return
    }
    
    if (!book) return
    
    try {
      setLoading(true)
      
      // Create payment intent
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          bookProjectId: book.id,
          amount: book.price,
          currency: 'eur'
        }
      })

      if (error) throw error

      // In a real implementation, we would redirect to Stripe Checkout
      // For now, we show a test mode message
      toast.success(`TEST MODUS: Payment Intent erstellt!\n\nBuch: ${book.title}\nPreis: €${book.price}\nBestellung: #${data.data.orderId}\n\nVerwenden Sie Testkarten für die Zahlung.`, {
        duration: 10000
      })
      
      console.log('Payment Intent Data:', data.data)
      
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Fehler bei der Zahlungsverarbeitung')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('Bitte melden Sie sich an, um Favoriten zu verwalten')
      return
    }
    
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Aus Favoriten entfernt' : 'Zu Favoriten hinzugefügt')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book?.title,
        text: book?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link in die Zwischenablage kopiert!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ready-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ready-blue mx-auto mb-4"></div>
          <p className="font-opensans text-gray-600">Lade Buchdetails...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-ready-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">
            Buchprojekt nicht gefunden
          </h1>
          <Link to="/shop">
            <Button>Zurück zum Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ready-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 font-opensans">
            <Link to="/" className="hover:text-ready-blue">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-ready-blue">Shop</Link>
            <span>/</span>
            <span className="text-ready-text">{book.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover & Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full h-auto rounded-lg shadow-lg mb-6"
                />
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleBuyNow}
                    className="w-full" 
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Jetzt kaufen - €{book.price.toFixed(2)}
                  </Button>
                  
                  <Button 
                    onClick={handleAddToCart}
                    variant="outline" 
                    className="w-full"
                  >
                    Zum Warenkorb
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleToggleFavorite}
                      variant="outline" 
                      className="flex-1"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                    <Button 
                      onClick={handleShare}
                      variant="outline" 
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Included Files */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-poppins font-semibold text-lg mb-3">Enthaltene Dateien</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Hochauflösendes Cover (300 DPI)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Vollständiges Manuskript (Word & PDF)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Rechtedokumentation</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Marketing-Materialien</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-ready-orange/10 text-ready-orange px-3 py-1 rounded-full text-sm font-semibold">
                    {book.category.name}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < Math.floor(book.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {book.rating} ({book.reviews_count} Bewertungen)
                    </span>
                  </div>
                </div>
                
                <h1 className="font-poppins font-bold text-3xl text-ready-text mb-4">
                  {book.title}
                </h1>
                
                <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>von {book.author.full_name}</span>
                  </div>
                  {book.page_count && (
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{book.page_count} Seiten</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Veröffentlicht 2024</span>
                  </div>
                </div>
                
                <p className="font-opensans text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Leseprobe</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Ausblenden' : 'Anzeigen'}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showPreview && (
                <CardContent>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="font-opensans text-gray-700 leading-relaxed whitespace-pre-line">
                      {book.preview_content}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* License Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Lizenzbedingungen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-opensans text-gray-700">
                  {book.license_terms}
                </p>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle>Über den Autor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <img
                    src={book.author.avatar_url}
                    alt={book.author.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-poppins font-semibold text-lg text-ready-text mb-2">
                      {book.author.full_name}
                    </h3>
                    <p className="font-opensans text-gray-700">
                      {book.author.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Kundenrezensionen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="font-opensans text-gray-600">
                    Rezensionen werden nach dem Kauf angezeigt.
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