# Supabase Setup Guide for MaySecret E-commerce

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: This project uses Vite, so environment variables must start with `VITE_` prefix.

### 3. Database Setup
1. Go to your Supabase project SQL Editor
2. Copy and run the entire `database/schema.sql` file
3. This will create all tables, indexes, and RLS policies

### 4. Storage Setup
1. Go to Supabase Storage
2. Create buckets:
   - `products` (public)
   - `avatars` (public)
3. Set up appropriate access policies

## 📁 Folder Structure Created

```
src/
├── lib/
│   └── supabaseClient.js     # Supabase client and helpers
├── services/
│   ├── authService.js        # Authentication operations
│   ├── productService.js      # Product CRUD operations
│   ├── orderService.js       # Order management
│   ├── reviewService.js      # Review system
│   └── cartService.js       # Shopping cart logic
└── database/
    └── schema.sql            # Complete database schema
```

## 🔧 Services Overview

### Authentication Service (`authService.js`)
- ✅ User signup/signin
- ✅ Profile management
- ✅ Password reset
- ✅ Auth state monitoring

### Product Service (`productService.js`)
- ✅ Fetch products (all, featured, by category)
- ✅ Product search
- ✅ CRUD operations
- ✅ Image upload to Supabase Storage

### Order Service (`orderService.js`)
- ✅ Create orders
- ✅ Order tracking
- ✅ Payment status updates
- ✅ Order statistics

### Review Service (`reviewService.js`)
- ✅ Product reviews
- ✅ User reviews
- ✅ Rating calculations
- ✅ Admin approval system

### Cart Service (`cartService.js`)
- ✅ Guest and user carts
- ✅ Cart operations (add, update, remove)
- ✅ Cart merging on login
- ✅ Price calculations

## 🗄️ Database Schema

### Tables Created:
- `users` - User profiles and authentication
- `products` - Product catalog with images
- `orders` - Order management
- `order_items` - Order line items
- `reviews` - Product review system
- `shopping_cart` - Persistent cart storage
- `wishlists` - User wishlists

### Features:
- ✅ Row Level Security (RLS) enabled
- ✅ Automatic timestamps
- ✅ UUID primary keys
- ✅ Proper indexes for performance
- ✅ Foreign key relationships

## 🔌 Integration Examples

### Using Authentication Service
```javascript
import authService from '../services/authService';

// Sign up
const result = await authService.signUp('email@example.com', 'password', 'John', 'Doe');

// Sign in
const result = await authService.signIn('email@example.com', 'password');

// Get current user
const { user } = await authService.getCurrentUser();
```

### Using Product Service
```javascript
import productService from '../services/productService';

// Get all products
const { data } = await productService.getAllProducts();

// Get featured products
const { data } = await productService.getFeaturedProducts(8);

// Search products
const { data } = await productService.searchProducts('serum');
```

### Using Order Service
```javascript
import orderService from '../services/orderService';

// Create order
const orderData = {
  user_id: userId,
  total_amount: 999.99,
  shipping_address: { /* address details */ }
};
const { data } = await orderService.createOrder(orderData);
```

## 🚦 Production Deployment

### Security Checklist:
- ✅ RLS policies enabled on all tables
- ✅ Environment variables secured
- ✅ Storage policies configured
- ✅ API rate limiting (in Supabase dashboard)
- ✅ Backup strategy configured

### Performance Optimizations:
- ✅ Database indexes created
- ✅ Image optimization via Supabase CDN
- ✅ Caching headers configured
- ✅ Query optimization

## 📞 Support

For issues:
1. Check Supabase logs
2. Verify environment variables
3. Review RLS policies
4. Test with Supabase client directly

## 🔄 Next Steps

1. Update existing components to use these services
2. Replace mock data with Supabase calls
3. Add error handling and loading states
4. Implement real-time features with Supabase Realtime
5. Set up Supabase Edge Functions for complex operations
