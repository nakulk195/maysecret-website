import { supabase } from '../lib/supabase';
import { withTimeout } from '../utils/safeAsync';

export type CouponDiscountType = 'fixed' | 'percentage' | 'free_shipping';

export interface CouponRow {
  id: string;
  code: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  min_order: number;
  active: boolean;
  expiry_date: string | null;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  discountAmount: number;
  minOrder: number;
}

const normalizeCouponCode = (code: string) => code.trim().toUpperCase();

const calculateDiscount = (coupon: CouponRow, subtotal: number) => {
  if (coupon.discount_type === 'fixed') {
    return Math.min(Number(coupon.discount_value || 0), subtotal);
  }

  if (coupon.discount_type === 'percentage') {
    const percentage = Math.max(0, Number(coupon.discount_value || 0));
    return Math.min(Math.round((subtotal * percentage) / 100), subtotal);
  }

  return 0;
};

export class CouponService {
  static async validateCoupon(code: string, subtotal: number): Promise<AppliedCoupon> {
    const normalizedCode = normalizeCouponCode(code);

    if (!normalizedCode) {
      throw new Error('Please enter a coupon code');
    }

    if (subtotal <= 0) {
      throw new Error('Add products to your cart before applying a coupon');
    }

    const { data, error } = await withTimeout(
      supabase
        .from('coupons')
        .select('id, code, discount_type, discount_value, min_order, active, expiry_date')
        .ilike('code', normalizedCode)
        .maybeSingle(),
      10000,
      'Coupon validation timed out'
    );

    if (error) {
      console.error('[CouponService] Supabase coupon lookup error:', error);
      throw new Error('Could not validate coupon. Please try again.');
    }

    if (!data) {
      throw new Error('Invalid coupon code');
    }

    const coupon = data as CouponRow;

    if (!coupon.active) {
      throw new Error('This coupon is not active');
    }

    if (coupon.expiry_date && new Date(coupon.expiry_date).getTime() < Date.now()) {
      throw new Error('Coupon expired');
    }

    const minOrder = Number(coupon.min_order || 0);
    if (subtotal < minOrder) {
      throw new Error(`Minimum order should be ₹${minOrder.toLocaleString()}`);
    }

    const discountAmount = calculateDiscount(coupon, subtotal);

    if (coupon.discount_type !== 'free_shipping' && discountAmount <= 0) {
      throw new Error('This coupon cannot be applied to your cart');
    }

    return {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: Number(coupon.discount_value || 0),
      discountAmount,
      minOrder,
    };
  }
}
