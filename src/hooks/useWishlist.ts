import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { wishlistService } from '../services/database';
import { WishlistItem } from '../types';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist when user changes
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await wishlistService.getUserWishlist(user.id);
      setWishlist(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await wishlistService.addToWishlist(user.id, productId);
      await fetchWishlist(); // Refresh wishlist
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await wishlistService.removeFromWishlist(user.id, productId);
      await fetchWishlist(); // Refresh wishlist
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = async (productId: string) => {
    if (!user) return false;
    
    try {
      return await wishlistService.isInWishlist(user.id, productId);
    } catch (err: any) {
      console.error('Error checking wishlist:', err);
      return false;
    }
  };

  return {
    wishlist,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
};
