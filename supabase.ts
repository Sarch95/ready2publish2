import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pdwormdyfzcoixuhpref.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkd29ybWR5Znpjb2l4dWhwcmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjAwMDAsImV4cCI6MjA2Nzg5NjAwMH0.nU67GNBB945ma4H7pI8gAOja4dp4s_WV60GSkMHYpW4'

// Configure auth options with correct redirect URL
const authOptions = {
  auth: {
    // Set the correct site URL for email confirmations
    redirectTo: 'https://ui5wzkmvb5.space.minimax.io/',
    // Automatically redirect after email confirmation
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, authOptions)

// Database types
export interface Profile {
  id: string
  email: string
  full_name?: string
  user_type: 'author' | 'buyer' | 'admin'
  bio?: string
  avatar_url?: string
  website?: string
  social_links?: any
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  slug: string
  created_at?: string
}

export interface BookProject {
  id: number
  author_id: string
  title: string
  description: string
  category_id: number
  page_count?: number
  price: number
  cover_image_url?: string
  preview_content?: string
  content_files?: any
  license_terms?: string
  status: 'active' | 'sold' | 'pending' | 'inactive'
  created_at?: string
  updated_at?: string
  author?: Profile
  category?: Category
  rating: number
  reviews_count: number
}

export interface Order {
  id: number
  buyer_id: string
  stripe_payment_intent_id?: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  total_amount: number
  platform_commission?: number
  currency: string
  billing_address?: any
  created_at?: string
  updated_at?: string
}

export interface OrderItem {
  id: number
  order_id: number
  book_project_id: number
  price_at_time: number
  created_at?: string
  book_project?: BookProject
}

export interface Review {
  id: number
  book_project_id: number
  reviewer_id: string
  order_id: number
  rating: number
  comment?: string
  created_at?: string
  reviewer?: Profile
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject?: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at?: string
}

export interface Favorite {
  id: number
  user_id: string
  book_project_id: number
  created_at?: string
  book_project?: BookProject
}