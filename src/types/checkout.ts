export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  address: Address;
  total: number;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'card' | 'upi' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export type PaymentMethod = 'card' | 'upi' | 'cod';

export interface PaymentDetails {
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
}
