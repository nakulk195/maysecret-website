import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export const supabaseClient = {
  // Auth helpers
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Database helpers
  fetch: async (table, options = {}) => {
    let query = supabase.from(table);
    
    if (options.select) query = query.select(options.select);
    if (options.eq) query = query.eq(options.eq.column, options.eq.value);
    if (options.order) query = query.order(options.order.column, { ascending: options.order.ascending || true });
    if (options.limit) query = query.limit(options.limit);
    if (options.single) query = query.single();

    const { data, error } = await query;
    return { data, error };
  },

  insert: async (table, data) => {
    const { data: result, error } = await supabase.from(table).insert(data);
    return { data: result, error };
  },

  update: async (table, data, condition) => {
    const { data: result, error } = await supabase.from(table).update(data).eq(condition.column, condition.value);
    return { data: result, error };
  },

  delete: async (table, condition) => {
    const { data, error } = await supabase.from(table).delete().eq(condition.column, condition.value);
    return { data, error };
  },

  // Storage helpers
  uploadImage: async (file, bucket = 'products') => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) return { data: null, error };

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { data: publicUrl, error: null };
  },

  getImageUrl: (fileName, bucket = 'products') => {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    return publicUrl;
  }
};

export default supabase;
