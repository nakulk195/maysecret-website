import { supabaseClient } from '../lib/supabaseClient';

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId, options = {}) => {
    try {
      const { data, error } = await supabaseClient.fetch('reviews', {
        select: `
          *,
          users (
            first_name,
            last_name
          )
        `,
        eq: { column: 'product_id', value: productId },
        eq: options.status ? { column: 'status', value: options.status } : null,
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

  // Create new review
  createReview: async (reviewData) => {
    try {
      const { data, error } = await supabaseClient.insert('reviews', {
        ...reviewData,
        status: 'pending', // Reviews need approval
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

  // Update review
  updateReview: async (reviewId, userId, updates) => {
    try {
      // First check if review belongs to user
      const { data: review, error: fetchError } = await supabaseClient.fetch('reviews', {
        select: 'user_id',
        eq: { column: 'id', value: reviewId },
        single: true
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!review) {
        throw new Error('Review not found');
      }

      if (review.user_id !== userId) {
        throw new Error('Unauthorized: You can only update your own reviews');
      }

      const { data, error } = await supabaseClient.update('reviews', {
        ...updates,
        updated_at: new Date().toISOString()
      }, { column: 'id', value: reviewId });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete review
  deleteReview: async (reviewId, userId) => {
    try {
      // First check if review belongs to user
      const { data: review, error: fetchError } = await supabaseClient.fetch('reviews', {
        select: 'user_id',
        eq: { column: 'id', value: reviewId },
        single: true
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!review) {
        throw new Error('Review not found');
      }

      if (review.user_id !== userId) {
        throw new Error('Unauthorized: You can only delete your own reviews');
      }

      const { error } = await supabaseClient.delete('reviews', { 
        column: 'id', 
        value: reviewId 
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user reviews
  getUserReviews: async (userId, options = {}) => {
    try {
      const { data, error } = await supabaseClient.fetch('reviews', {
        select: `
          *,
          products (
            name,
            image_urls
          )
        `,
        eq: { column: 'user_id', value: userId },
        order: { column: 'created_at', ascending: false },
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

  // Mark review as helpful
  markHelpful: async (reviewId) => {
    try {
      const { data: review, error: fetchError } = await supabaseClient.fetch('reviews', {
        select: 'helpful_count',
        eq: { column: 'id', value: reviewId },
        single: true
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!review) {
        throw new Error('Review not found');
      }

      const { data, error } = await supabaseClient.update('reviews', {
        helpful_count: review.helpful_count + 1,
        updated_at: new Date().toISOString()
      }, { column: 'id', value: reviewId });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Approve review (admin)
  approveReview: async (reviewId) => {
    try {
      const { data, error } = await supabaseClient.update('reviews', {
        status: 'approved',
        updated_at: new Date().toISOString()
      }, { column: 'id', value: reviewId });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reject review (admin)
  rejectReview: async (reviewId) => {
    try {
      const { data, error } = await supabaseClient.update('reviews', {
        status: 'rejected',
        updated_at: new Date().toISOString()
      }, { column: 'id', value: reviewId });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get average rating for product
  getProductAverageRating: async (productId) => {
    try {
      const { data, error } = await supabaseClient.fetch('reviews', {
        select: 'rating',
        eq: { column: 'product_id', value: productId },
        eq: { column: 'status', value: 'approved' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        return { success: true, data: { averageRating: 0, totalReviews: 0 } };
      }

      const totalReviews = data.length;
      const averageRating = data.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

      return { 
        success: true, 
        data: { 
          averageRating: parseFloat(averageRating.toFixed(1)), 
          totalReviews 
        } 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default reviewService;
