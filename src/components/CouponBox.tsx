import React, { useState } from 'react';
import { CheckCircle, Loader2, Tag, X } from 'lucide-react';
import { AppliedCoupon, CouponService } from '../services/couponService';

interface CouponBoxProps {
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  onCouponChange: (coupon: AppliedCoupon | null) => void;
}

const CouponBox: React.FC<CouponBoxProps> = ({ subtotal, appliedCoupon, onCouponChange }) => {
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isApplying, setIsApplying] = useState(false);

  const applyCoupon = async () => {
    setIsApplying(true);
    setMessage('');
    setMessageType('');

    try {
      const coupon = await CouponService.validateCoupon(couponCode, subtotal);
      onCouponChange(coupon);
      setCouponCode(coupon.code);
      setMessage(`Coupon applied. You saved ₹${coupon.discountAmount.toLocaleString()}`);
      setMessageType('success');
    } catch (error) {
      onCouponChange(null);
      setMessage(error instanceof Error ? error.message : 'Invalid coupon code');
      setMessageType('error');
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    onCouponChange(null);
    setCouponCode('');
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-900" />
        <p className="text-sm font-semibold text-gray-900">Have a coupon code?</p>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-green-800">{appliedCoupon.code}</p>
              <p className="text-xs text-green-700">
                Saved ₹{appliedCoupon.discountAmount.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-green-800 transition-colors hover:bg-green-100"
            aria-label="Remove coupon"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                applyCoupon();
              }
            }}
            placeholder="Enter coupon code"
            className="min-h-[44px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium uppercase tracking-wide text-gray-900 outline-none transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
          <button
            type="button"
            onClick={applyCoupon}
            disabled={isApplying}
            className="min-h-[44px] rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApplying ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Applying
              </span>
            ) : (
              'Apply'
            )}
          </button>
        </div>
      )}

      {message && !appliedCoupon && (
        <p className={`mt-2 text-xs ${messageType === 'error' ? 'text-red-600' : 'text-green-700'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CouponBox;
