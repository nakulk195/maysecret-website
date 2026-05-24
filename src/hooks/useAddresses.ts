import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addressService } from '../services/database';
import { Address } from '../lib/supabase';
import { getErrorMessage, withTimeout } from '../utils/safeAsync';

export const useAddresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch addresses when user changes
  useEffect(() => {
    let isActive = true;

    const load = async () => {
      if (!user) {
        if (isActive) {
          setAddresses([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await withTimeout(
          addressService.getUserAddresses(user.id),
          10000,
          'Address load timed out'
        );
        if (isActive) setAddresses(data);
      } catch (err: any) {
        if (isActive) {
          setError(getErrorMessage(err));
          setAddresses([]);
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

  const fetchAddresses = async () => {
    if (user) {
      setLoading(true);
      setError(null);

      try {
        const data = await withTimeout(
          addressService.getUserAddresses(user.id),
          10000,
          'Address load timed out'
        );
        setAddresses(data);
      } catch (err: any) {
        setError(getErrorMessage(err));
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    } else {
      setAddresses([]);
      setLoading(false);
    }
  };

  const addAddress = async (addressData: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await withTimeout(
        addressService.createAddress(user.id, addressData),
        10000,
        'Address save timed out'
      );
      setAddresses(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId: string, updates: Partial<Address>) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await withTimeout(
        addressService.updateAddress(addressId, updates),
        10000,
        'Address update timed out'
      );
      setAddresses(prev => prev.map(addr => addr.id === addressId ? data : addr));
      return data;
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await withTimeout(
        addressService.deleteAddress(addressId),
        10000,
        'Address delete timed out'
      );
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress
  };
};
