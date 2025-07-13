import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { Search, Filter, Star, Grid, List } from 'lucide-react'
import { BookProject, Category, supabase } from '../lib/supabase'
import { toast } from 'sonner'

export function ShopPage() {
  const [books, setBooks] = useState<BookProject[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredBooks, setFilteredBooks] = useState<BookProject[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 })
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBooksAndCategories()
  }, [])

  const loadBooksAndCategories = async () => {
    try {
      setLoading(true)
      
      // Load books, authors, and categories separately
      const [booksResponse, authorsResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('book_projects')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('id, full_name, avatar_url, bio'),
        supabase
          .from('categories')
          .select('*')
          .order('name')
      ])

      if (booksResponse.error) throw booksResponse.error
      if (authorsResponse.error) throw authorsResponse.error  
      if (categoriesResponse.error) throw categoriesResponse.error

      // Create lookup maps for efficient data joining
      const authorsMap = new Map(authorsResponse.data?.map(author => [author.id, author]) || [])
      const categoriesMap = new Map(categoriesResponse.data?.map(cat => [cat.id, cat]) || [])

      // Combine data manually
      const booksWithDetails = (booksResponse.data || []).map(book => ({
        ...book,
        author: authorsMap.get(book.author_id) || null,
        category: categoriesMap.get(book.category_id) || null,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        reviews_count: Math.floor(Math.random() * 50) + 10 // Random reviews 10-60
      }))

      setBooks(booksWithDetails)
      setCategories(categoriesResponse.data || [])
      setFilteredBooks(booksWithDetails)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Fehler beim Laden der Buchprojekte')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = books

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(book => book.category_id === selectedCategory)
    }

    // Price filter
    filtered = filtered.filter(book => 
      book.price >= priceRange.min && book.price <= priceRange.max
    )

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default: // newest
        filtered.sort((a, b) => b.id - a.id)
    }

    setFilteredBooks(filtered)
  }, [books, searchTerm, selectedCategory, priceRange, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen bg-ready-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ready-blue mx-auto mb-4"></div>
          <p className="font-opensans text-gray-600">Lade Buchprojekte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ready-bg">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-poppins font-bold text-3xl text-ready-text mb-4">
            Buchprojekte Shop
          </h1>
          <p className="font-opensans text-gray-600">
            Entdecken Sie {books.length} professionelle Buchprojekte von erfahrenen Autoren
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Filter className="h-5 w-5 text-ready-blue mr-2" />
                  <h2 className="font-poppins font-semibold text-lg">Filter</h2>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                    Suche
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Titel, Autor, Beschreibung..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                    Kategorie
                  </label>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ready-blue focus:border-ready-blue"
                  >
                    <option value="">Alle Kategorien</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                    Preis (€{priceRange.min} - €{priceRange.max})
                  </label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory(null)
                    setPriceRange({ min: 0, max: 1000 })
                  }}
                  className="w-full"
                >
                  Filter zurücksetzen
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <span className="font-opensans text-gray-600">
                  {filteredBooks.length} Ergebnisse
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ready-blue focus:border-ready-blue"
                >
                  <option value="newest">Neueste zuerst</option>
                  <option value="price-low">Preis: Niedrig zu Hoch</option>
                  <option value="price-high">Preis: Hoch zu Niedrig</option>
                  <option value="rating">Beste Bewertung</option>
                  <option value="title">Titel A-Z</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-ready-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-ready-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredBooks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="font-opensans text-gray-600 text-lg mb-4">
                    Keine Buchprojekte gefunden
                  </p>
                  <p className="font-opensans text-gray-500 mb-6">
                    Versuchen Sie andere Suchbegriffe oder Filter
                  </p>
                  <Button onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory(null)
                    setPriceRange({ min: 0, max: 1000 })
                  }}>
                    Filter zurücksetzen
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredBooks.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className={`p-0 ${viewMode === 'list' ? 'flex' : ''}`}>
                      <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full'}`}>
                        <img
                          src={book.cover_image_url}
                          alt={book.title}
                          className={`w-full object-cover rounded-t-lg ${
                            viewMode === 'list' ? 'h-full rounded-l-lg rounded-t-none' : 'h-64'
                          }`}
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-ready-orange font-semibold">
                            {book.category.name}
                          </span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {book.rating} ({book.reviews_count})
                            </span>
                          </div>
                        </div>
                        <h3 className="font-poppins font-semibold text-lg text-ready-text mb-2">
                          {book.title}
                        </h3>
                        <p className="font-opensans text-gray-600 text-sm mb-3 line-clamp-2">
                          {book.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <span>von {book.author.full_name}</span>
                          {book.page_count && (
                            <span className="ml-4">{book.page_count} Seiten</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-poppins font-bold text-xl text-ready-blue">
                            €{book.price.toFixed(2)}
                          </span>
                          <Link to={`/book/${book.id}`}>
                            <Button>
                              Details ansehen
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}