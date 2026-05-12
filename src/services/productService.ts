import { supabase, Product } from '../lib/supabase';

export class ProductService {
  // Fetch all products
  static async getAllProducts(): Promise<Product[]> {
    try {
      console.log('Fetching all products from Supabase');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched products:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; // Return empty array on error to prevent crashes
    }
  }

  // Fetch products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log('Fetching products by category:', category);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched products by category:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return []; // Return empty array on error to prevent crashes
    }
  }

  // Fetch featured products
  static async getFeaturedProducts(): Promise<Product[]> {
    try {
      console.log('Fetching featured products');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched featured products:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return []; // Return empty array on error to prevent crashes
    }
  }

  // Fetch single product by ID
  static async getProductById(id: string): Promise<Product | null> {
    try {
      console.log('Fetching product by ID:', id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      console.log('Fetched product:', data);
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null; // Return null on error to prevent crashes
    }
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      console.log('Searching products with query:', query);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Search results:', data);
      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return []; // Return empty array on error to prevent crashes
    }
  }

  // Get product categories
  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .order('category');

      if (error) throw error;
      
      // Extract unique categories
      const categories = Array.from(new Set((data || []).map(item => item.category)));
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}
