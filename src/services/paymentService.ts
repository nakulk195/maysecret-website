import { loadRazorpay } from '../utils/razorpay';

export interface PaymentOptions {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

export class PaymentService {
  // Initialize Razorpay
  static async initializeRazorpay(): Promise<any> {
    try {
      const razorpay = await loadRazorpay();
      
      if (!razorpay) {
        throw new Error('Razorpay SDK failed to load');
      }

      return new (window as any).Razorpay({
        key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
        key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET,
      });
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      throw error;
    }
  }

  // Create payment order
  static async createOrder(amount: number): Promise<{ id: string; amount: number; currency: string }> {
    try {
      // This would typically be done on your backend server
      // For now, we'll create a mock order
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects amount in paise
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment order:', error);
      // Fallback to mock order for development
      return {
        id: `order_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR',
      };
    }
  }

  // Process payment
  static async processPayment(options: PaymentOptions): Promise<PaymentResult> {
    try {
      const razorpay = await this.initializeRazorpay();
      const order = await this.createOrder(options.amount);

      return new Promise((resolve) => {
        const razorpayOptions = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: options.name,
          description: options.description,
          order_id: order.id,
          prefill: options.prefill,
          theme: {
            color: options.theme?.color || '#3399cc',
          },
          handler: (response: any) => {
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => {
              resolve({
                success: false,
                error: 'Payment cancelled by user',
              });
            },
          },
        };

        const paymentObject = new (window as any).Razorpay(razorpayOptions);
        paymentObject.open();
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  // Verify payment signature (this would typically be done on backend)
  static verifyPayment(paymentId: string, orderId: string, signature: string): boolean {
    // This is a mock verification
    // In production, this should be done on your backend server
    return !!(paymentId && orderId && signature);
  }
}
