import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addressService } from '../services/database';
import { Address } from '../lib/supabase';

export const useAddresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch addresses when user changes
  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setAddresses([]);
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await addressService.getUserAddresses(user.id);
      setAddresses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (addressData: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await addressService.createAddress(user.id, addressData);
      setAddresses(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId: string, updates: Partial<Address>) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await addressService.updateAddress(addressId, updates);
      setAddresses(prev => prev.map(addr => addr.id === addressId ? data : addr));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await addressService.deleteAddress(addressId);
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    } catch (err: any) {
      setError(err.message);
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
