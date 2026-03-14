import { supabaseClient } from '../lib/supabaseClient';

export const productService = {
  // Get all products
  getAllProducts: async (options = {}) => {
    try {
      const { data, error } = await supabaseClient.fetch('products', {
        select: '*',
        order: { column: 'created_at', ascending: false },
        eq: options.category ? { column: 'category', value: options.category } : null,
        limit: options.limit || null
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    try {
      const { data, error } = await supabaseClient.fetch('products', {
        select: '*',
        eq: { column: 'featured', value: true },
        order: { column: 'created_at', ascending: false },
        limit
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    try {
      const { data, error } = await supabaseClient.fetch('products', {
        select: '*',
        eq: { column: 'slug', value: slug },
        single: true
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const { data, error } = await supabaseClient.fetch('products', {
        select: '*',
        eq: { column: 'id', value: id },
        single: true
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search products
  searchProducts: async (query, options = {}) => {
    try {
      const { data, error } = await supabaseClient.fetch('products', {
        select: '*',
        or: `name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`,
        order: { column: 'created_at', ascending: false },
        limit: options.limit || 20
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get products by category
  getProductsByCategory: async (category, limit = 20) => {
    try {
      const { data, error } = await supabaseClient.fetch('products', {
        select: '*',
        eq: { column: 'category', value: category },
        order: { column: 'created_at', ascending: false },
        limit
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create new product (admin)
  createProduct: async (productData) => {
    try {
      const { data, error } = await supabaseClient.insert('products', {
        ...productData,
        brand: 'MΛY SΞCRΞT',
        status: 'active',
        created_at: new Date().toISOString()
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update product (admin)
  updateProduct: async (productId, updates) => {
    try {
      const { data, error } = await supabaseClient.update('products', {
        ...updates,
        updated_at: new Date().toISOString()
      }, { column: 'id', value: productId });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete product (admin)
  deleteProduct: async (productId) => {
    try {
      const { error } = await supabaseClient.delete('products', { column: 'id', value: productId });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Upload product image
  uploadProductImage: async (file) => {
    try {
      const { data, error } = await supabaseClient.uploadImage(file, 'products');

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default productService;
