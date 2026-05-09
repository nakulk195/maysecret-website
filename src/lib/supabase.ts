import { createClient } from '@supabase/supabase-js'

// Use fallback credentials if environment variables are missing
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://vhagoajwgolskffqkmqd.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYWdvYWp3Z29sc2tmZnFrbXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzAwNjAsImV4cCI6MjA5MzgwNjA2MH0.iCpoEEUj2b2fQ8__4qB7Hxd18U1GUGnWalU0FS5-Kpk'

// Log warning if using fallbacks
if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.warn('Using fallback Supabase credentials. Please set up your .env file with:')
  console.warn('REACT_APP_SUPABASE_URL=https://vhagoajwgolskffqkmqd.supabase.co')
  console.warn('REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYWdvYWp3Z29sc2tmZnFrbXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzAwNjAsImV4cCI6MjA5MzgwNjA2MH0.iCpoEEUj2b2fQ8__4qB7Hxd18U1GUGnWalU0FS5-Kpk')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          original_price?: number
          image: string
          category: string
          in_stock: boolean
          is_featured: boolean
          rating: number
          reviews: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          original_price?: number
          image: string
          category: string
          in_stock?: boolean
          is_featured?: boolean
          rating?: number
          reviews?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          original_price?: number
          image?: string
          category?: string
          in_stock?: boolean
          is_featured?: boolean
          rating?: number
          reviews?: number
          created_at?: string
          updated_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: any
          payment_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: any
          payment_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: any
          payment_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
  }
}

export type Product = Database['public']['Tables']['products']['Row']
export type Cart = Database['public']['Tables']['cart']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
