import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { wishlistService } from '../services/database';
import { WishlistItem } from '../types';
import { getErrorMessage, withTimeout } from '../utils/safeAsync';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist when user changes
  useEffect(() => {
    let isActive = true;

    const load = async () => {
      if (!user) {
        if (isActive) {
          setWishlist([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await withTimeout(
          wishlistService.getUserWishlist(user.id),
          10000,
          'Wishlist load timed out'
        );
        if (isActive) setWishlist(data);
      } catch (err: any) {
        if (isActive) {
          setError(getErrorMessage(err));
          setWishlist([]);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await withTimeout(
        wishlistService.getUserWishlist(user.id),
        10000,
        'Wishlist load timed out'
      );
      setWishlist(data);
    } catch (err: any) {
      setError(getErrorMessage(err));
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await withTimeout(
        wishlistService.addToWishlist(user.id, productId),
        10000,
        'Wishlist add timed out'
      );
      await fetchWishlist(); // Refresh wishlist
    } catch (err: any) {
      setError(getErrorMessage(err));
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
      await withTimeout(
        wishlistService.removeFromWishlist(user.id, productId),
        10000,
        'Wishlist remove timed out'
      );
      await fetchWishlist(); // Refresh wishlist
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = async (productId: string) => {
    if (!user) return false;
    
    try {
      return await withTimeout(
        wishlistService.isInWishlist(user.id, productId),
        10000,
        'Wishlist check timed out'
      );
    } catch (err: any) {
      console.error('Error checking wishlist:', getErrorMessage(err));
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
