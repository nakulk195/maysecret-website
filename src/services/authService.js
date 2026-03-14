import { supabaseClient } from '../lib/supabaseClient';

export const authService = {
  // Sign up new user
  signUp: async (email, password, firstName, lastName, phone = '') => {
    try {
      const { data, error } = await supabaseClient.signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        phone: phone
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign in user
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabaseClient.signIn(email, password);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      const { error } = await supabaseClient.signOut();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { user, error } = await supabaseClient.getCurrentUser();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabaseClient.update('users', updates, { column: 'id', value: userId });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabaseClient.onAuthStateChange((event, session) => {
      callback(event, session?.user || null);
    });
  }
};

export default authService;
