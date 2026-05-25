import { User } from '@supabase/supabase-js';
import { CartItem } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { resolveSupabaseProductIdFromValue } from '../utils/productIdResolver';
import { loadRazorpay } from '../utils/razorpay';
import { getErrorMessage, withTimeout } from '../utils/safeAsync';
import { safeRemoveItem } from '../utils/safeStorage';

export interface CheckoutAddress {
  id?: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  houseNo: string;
  apartment?: string;
  area?: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

interface CheckoutParams {
  user: User;
  cart: CartItem[];
  totalAmount: number;
  address: CheckoutAddress;
  clearCart: () => Promise<void>;
}

const createRazorpayOrder = async (amount: number) => {
  const response = await withTimeout(
    fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      }),
    }),
    10000,
    'Payment order creation timed out'
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unable to create payment order: ${errorText}`);
  }

  const data = await response.json();
  if (!data.success || !data.order) {
    throw new Error(data.error || 'Unable to create payment order');
  }

  return data.order;
};

const verifyPayment = async (response: any) => {
  const verifyResponse = await withTimeout(
    fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    }),
    10000,
    'Payment verification timed out'
  );

  const data = await verifyResponse.json();
  if (!verifyResponse.ok || !data.success) {
    throw new Error(data.error || 'Payment verification failed');
  }
};

const saveOrderToSupabase = async (
  user: User,
  cart: CartItem[],
  totalAmount: number,
  address: CheckoutAddress,
  razorpayResponse: any
) => {
  const orderPayload: any = {
    user_id: user.id,
    total_amount: totalAmount,
    status: 'pending',
    payment_id: razorpayResponse.razorpay_payment_id,
    razorpay_order_id: razorpayResponse.razorpay_order_id,
    razorpay_signature: razorpayResponse.razorpay_signature,
    payment_status: 'completed',
    order_status: 'processing',
    address_id: address.id || null,
    address: JSON.stringify(address),
  };

  const { data: orderData, error: orderError } = await withTimeout(supabase
    .from('orders')
    .insert(orderPayload)
    .select()
    .single(),
    10000,
    'Order save timed out'
  );

  if (orderError) {
    console.error('[checkoutService] Supabase order insert error:', orderError);
    throw orderError;
  }

  if (!orderData?.id) {
    throw new Error('Order was not saved correctly');
  }

  const orderItems = await Promise.all(
    cart.map(async item => {
      const resolvedProductId = await resolveSupabaseProductIdFromValue(item.product_id);

      return {
        order_id: orderData.id,
        product_id: resolvedProductId,
        product_name: item.cartProduct?.name || '',
        product_image: item.cartProduct?.image || '',
        product_price: Number(item.cartProduct?.price || 0),
        quantity: item.quantity,
        price: Number(item.cartProduct?.price || 0),
      };
    })
  );

  const { error: itemsError } = await withTimeout(supabase
    .from('order_items')
    .insert(orderItems),
    10000,
    'Order items save timed out'
  );

  if (itemsError) {
    console.error('[checkoutService] Supabase order_items insert error:', itemsError);
    throw itemsError;
  }

  return orderData;
};

export const startRazorpayCheckout = async ({
  user,
  cart,
  totalAmount,
  address,
  clearCart,
}: CheckoutParams) => {
  if (!cart.length) {
    throw new Error('Your cart is empty');
  }

  if (!address) {
    throw new Error('Please select a delivery address');
  }

  const isLoaded = await loadRazorpay();
  if (!isLoaded || !window.Razorpay) {
    throw new Error('Razorpay could not be loaded. Please try again.');
  }

  const razorpayOrder = await createRazorpayOrder(totalAmount);
  const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;

  if (!razorpayKeyId) {
    throw new Error('Razorpay key is not configured');
  }

  return new Promise<any>((resolve, reject) => {
    const options = {
      key: razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'MAY SECRET',
      description: 'Premium skincare products',
      order_id: razorpayOrder.id,
      handler: async (response: any) => {
        try {
          await verifyPayment(response);
          const orderData = await saveOrderToSupabase(user, cart, totalAmount, address, response);
          try {
            await clearCart();
          } catch (cartError) {
            console.error('[checkoutService] Order saved but cart clear failed:', getErrorMessage(cartError));
          }
          safeRemoveItem('shipping_address');
          resolve(orderData);
        } catch (error) {
          console.error('[checkoutService] Payment completed but checkout finalization failed:', getErrorMessage(error));
          reject(error);
        }
      },
      prefill: {
        name: address.fullName || user.user_metadata?.full_name || user.email || 'Customer',
        email: address.emailAddress || user.email || '',
        contact: address.mobileNumber || '',
      },
      notes: {
        user_id: user.id,
      },
      theme: {
        color: '#111827',
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  });
};
