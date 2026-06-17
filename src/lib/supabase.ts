import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.')
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
          stock: number
          category: string
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
          stock: number
          category: string
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
          stock?: number
          category?: string
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
          user_id?: string
          total_amount: number
          payment_method?: string
          payment_status?: string
          order_status?: string
          address?: string
          order_number?: number
          razorpay_order_id?: string
          razorpay_signature?: string
          address_id?: string
          payment_id?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          total_amount: number
          payment_method?: string
          payment_status?: string
          order_status?: string
          address?: string
          order_number?: number
          razorpay_order_id?: string
          razorpay_signature?: string
          address_id?: string
          payment_id?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          payment_method?: string
          payment_status?: string
          order_status?: string
          address?: string
          order_number?: number
          razorpay_order_id?: string
          razorpay_signature?: string
          address_id?: string
          payment_id?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id?: string
          quantity?: number
          price?: number
          product_id?: string
          product_number?: number
          product_name?: string
          product_image?: string
          product_price?: number
        }
        Insert: {
          id?: string
          order_id?: string
          quantity?: number
          price?: number
          product_id?: string
          product_number?: number
          product_name?: string
          product_image?: string
          product_price?: number
        }
        Update: {
          id?: string
          order_id?: string
          quantity?: number
          price?: number
          product_id?: string
          product_number?: number
          product_name?: string
          product_image?: string
          product_price?: number
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string
          email?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string
          email?: string
          address_line_1: string
          address_line_2: string
          landmark: string
          city: string
          state: string
          pincode: string
          country: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone: string
          email?: string
          address_line_1: string
          address_line_2?: string
          landmark?: string
          city: string
          state: string
          pincode: string
          country: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone?: string
          email?: string
          address_line_1?: string
          address_line_2?: string
          landmark?: string
          city?: string
          state?: string
          pincode?: string
          country?: string
          created_at?: string
          updated_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          subject: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          subject: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          subject?: string
          message?: string
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
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Address = Database['public']['Tables']['addresses']['Row']
export type Wishlist = Database['public']['Tables']['wishlist']['Row']
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
