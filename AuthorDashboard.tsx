import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Upload, BookOpen, Plus, Edit, Trash2, Eye, DollarSign } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, BookProject, Category } from '../lib/supabase'
import { toast } from 'sonner'

interface BookProjectForm {
  title: string
  description: string
  category_id: number
  page_count: number
  price: number
  preview_content: string
  license_terms: string
}

export function AuthorDashboard() {
  const { user, profile } = useAuth()
  const [myBooks, setMyBooks] = useState<BookProject[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [showNewBookForm, setShowNewBookForm] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingManuscript, setUploadingManuscript] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookProjectForm>()

  useEffect(() => {
    if (user && profile?.user_type === 'author') {
      loadMyBooks()
      loadCategories()
    }
  }, [user, profile])

  const loadMyBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('book_projects')
        .select(`
          *,
          category:categories!category_id(name, slug)
        `)
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMyBooks(data || [])
    } catch (error) {
      console.error('Error loading books:', error)
      toast.error('Fehler beim Laden der Buchprojekte')
    }
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const uploadFile = async (file: File, bucketName: string) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string
          
          const { data, error } = await supabase.functions.invoke('upload-book-files', {
            body: {
              fileData: base64Data,
              fileName: file.name,
              fileType: file.type,
              bucketName
            }
          })

          if (error) throw error
          resolve(data.data.publicUrl)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const onSubmit = async (data: BookProjectForm) => {
    if (!user) {
      toast.error('Sie müssen angemeldet sein')
      return
    }

    if (!coverFile) {
      toast.error('Bitte wählen Sie ein Cover-Bild aus')
      return
    }

    setLoading(true)

    try {
      // Upload cover image
      setUploadingCover(true)
      const coverUrl = await uploadFile(coverFile, 'book-covers')
      setUploadingCover(false)

      // Upload manuscript if provided
      let contentFiles = null
      if (manuscriptFile) {
        setUploadingManuscript(true)
        const manuscriptUrl = await uploadFile(manuscriptFile, 'book-files')
        contentFiles = {
          manuscript: manuscriptUrl,
          originalName: manuscriptFile.name
        }
        setUploadingManuscript(false)
      }

      // Create book project
      const bookData = {
        author_id: user.id,
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        page_count: data.page_count,
        price: data.price,
        cover_image_url: coverUrl,
        preview_content: data.preview_content,
        license_terms: data.license_terms,
        content_files: contentFiles,
        status: 'pending' // Requires admin approval
      }

      const { error } = await supabase
        .from('book_projects')
        .insert(bookData)

      if (error) throw error

      toast.success('Buchprojekt erfolgreich eingereicht! Es wird zur Qualitätsprüfung gesendet.')
      reset()
      setCoverFile(null)
      setManuscriptFile(null)
      setShowNewBookForm(false)
      loadMyBooks()
    } catch (error: any) {
      console.error('Error creating book project:', error)
      toast.error(error.message || 'Fehler beim Erstellen des Buchprojekts')
    } finally {
      setLoading(false)
      setUploadingCover(false)
      setUploadingManuscript(false)
    }
  }

  const deleteBook = async (bookId: number) => {
    if (!confirm('Möchten Sie dieses Buchprojekt wirklich löschen?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('book_projects')
        .delete()
        .eq('id', bookId)
        .eq('author_id', user?.id) // Ensure user can only delete their own books

      if (error) throw error

      toast.success('Buchprojekt gelöscht')
      loadMyBooks()
    } catch (error: any) {
      console.error('Error deleting book:', error)
      toast.error('Fehler beim Löschen des Buchprojekts')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ready-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">
            Anmeldung erforderlich
          </h1>
          <p className="font-opensans text-gray-600">Bitte melden Sie sich an, um Ihr Dashboard zu sehen.</p>
        </div>
      </div>
    )
  }

  if (profile?.user_type !== 'author') {
    return (
      <div className="min-h-screen bg-ready-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-poppins font-bold text-2xl text-ready-text mb-4">
            Nur für Autoren
          </h1>
          <p className="font-opensans text-gray-600">Dieses Dashboard ist nur für registrierte Autoren verfügbar.</p>
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
            Autoren-Dashboard
          </h1>
          <p className="font-opensans text-gray-600">
            Willkommen zurück, {profile?.full_name}! Verwalten Sie hier Ihre Buchprojekte.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-ready-blue mr-3" />
                <div>
                  <p className="text-sm font-opensans text-gray-600">Meine Bücher</p>
                  <p className="text-2xl font-poppins font-bold text-ready-text">{myBooks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-opensans text-gray-600">Aktive Projekte</p>
                  <p className="text-2xl font-poppins font-bold text-ready-text">
                    {myBooks.filter(book => book.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-ready-orange mr-3" />
                <div>
                  <p className="text-sm font-opensans text-gray-600">Verkäufe</p>
                  <p className="text-2xl font-poppins font-bold text-ready-text">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Upload className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-opensans text-gray-600">Wartend</p>
                  <p className="text-2xl font-poppins font-bold text-ready-text">
                    {myBooks.filter(book => book.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <Button
            onClick={() => setShowNewBookForm(!showNewBookForm)}
            className="inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Neues Buchprojekt hinzufügen
          </Button>
        </div>

        {/* New Book Form */}
        {showNewBookForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Neues Buchprojekt erstellen</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                      Titel *
                    </label>
                    <Input
                      {...register('title', { required: 'Titel ist erforderlich' })}
                      error={errors.title?.message}
                      placeholder="Der Titel Ihres Buchprojekts"
                    />
                  </div>

                  <div>
                    <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                      Kategorie *
                    </label>
                    <select
                      {...register('category_id', { required: 'Kategorie ist erforderlich' })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ready-blue focus:border-ready-blue"
                    >
                      <option value="">Kategorie wählen</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                    Beschreibung *
                  </label>
                  <textarea
                    {...register('description', { required: 'Beschreibung ist erforderlich' })}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-ready-blue focus:border-ready-blue"
                    placeholder="Beschreiben Sie Ihr Buchprojekt ausführlich..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                      Seitenzahl
                    </label>
                    <Input
                      type="number"
                      {...register('page_count')}
                      placeholder="z.B. 250"
                    />
                  </div>

                  <div>
                    <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                      Preis (EUR) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('price', { required: 'Preis ist erforderlich' })}
                      error={errors.price?.message}
                      placeholder="z.B. 299.99"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                    Cover-Bild * (JPG, PNG, WebP - max. 5MB)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ready-blue focus:border-ready-blue"
                  />
                  {uploadingCover && <p className="text-sm text-blue-600 mt-1">Cover wird hochgeladen...</p>}
                </div>

                <div>
                  <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                    Manuskript (PDF, DOCX - max. 50MB) - Optional
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => setManuscriptFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ready-blue focus:border-ready-blue"
                  />
                  {uploadingManuscript && <p className="text-sm text-blue-600 mt-1">Manuskript wird hochgeladen...</p>}
                </div>

                <div>
                  <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                    Leseprobe *
                  </label>
                  <textarea
                    {...register('preview_content', { required: 'Leseprobe ist erforderlich' })}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-ready-blue focus:border-ready-blue"
                    placeholder="Fügen Sie hier eine aussagekräftige Leseprobe ein..."
                  />
                  {errors.preview_content && (
                    <p className="mt-1 text-sm text-red-500">{errors.preview_content.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-opensans font-medium text-sm text-gray-700 mb-2">
                    Lizenzbedingungen *
                  </label>
                  <textarea
                    {...register('license_terms', { required: 'Lizenzbedingungen sind erforderlich' })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-ready-blue focus:border-ready-blue"
                    placeholder="z.B. Vollständige Rechte inklusive Verlagsrechte, Übersetzungsrechte..."
                  />
                  {errors.license_terms && (
                    <p className="mt-1 text-sm text-red-500">{errors.license_terms.message}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    disabled={loading || uploadingCover || uploadingManuscript}
                  >
                    {loading ? 'Wird erstellt...' : 'Buchprojekt einreichen'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewBookForm(false)}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* My Books */}
        <Card>
          <CardHeader>
            <CardTitle>Meine Buchprojekte</CardTitle>
          </CardHeader>
          <CardContent>
            {myBooks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="font-opensans text-gray-600">
                  Sie haben noch keine Buchprojekte eingereicht.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBooks.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <img
                        src={book.cover_image_url || '/images/book-cover-1.jpg'}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-poppins font-semibold text-lg mb-2">{book.title}</h3>
                      <p className="font-opensans text-sm text-gray-600 mb-2 line-clamp-2">
                        {book.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-poppins font-bold text-ready-blue">
                          €{book.price.toFixed(2)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          book.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : book.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.status === 'active' ? 'Aktiv' : 
                           book.status === 'pending' ? 'Wartend' : 'Inaktiv'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Bearbeiten
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteBook(book.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}