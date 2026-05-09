# Supabase Database Setup Guide

This guide will help you set up the Supabase database for your MAY SECRET ecommerce website.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login with your GitHub account
4. Click "New Project"
5. Choose your organization
6. Set project name: `maysecret-website`
7. Set database password (save it securely)
8. Choose a region closest to your users
9. Click "Create new project"

## 2. Environment Variables

Copy the following to your `.env` file:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay Configuration  
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Get these values from:
- Supabase Project Settings → API
- Razorpay Dashboard → API Keys

## 3. Database Tables

Run these SQL commands in Supabase SQL Editor:

### Products Table
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
```

### Cart Table
```sql
CREATE TABLE cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create index for better performance
CREATE INDEX idx_cart_user_id ON cart(user_id);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB NOT NULL,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

## 4. Row Level Security (RLS)

Enable RLS and create policies:

### Products Table (Public Read Access)
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Cart Table (User-specific Access)
```sql
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cart" ON cart
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart
  FOR DELETE USING (auth.uid() = user_id);
```

### Orders Table (User-specific Access)
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);
```

### Order Items Table (User-specific Access)
```sql
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view order items from their orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items for their orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );
```

## 5. Sample Data (Optional)

Insert sample products to test:
```sql
INSERT INTO products (name, description, price, original_price, image, category, in_stock, is_featured, rating, reviews) VALUES
('MAY SECRET Sunscreen Spray', 'Advanced sunscreen spray with SPF 50 PA+++ protection', 1299.00, 1599.00, 'https://your-domain.com/sunscreen.jpg', 'sunscreen', true, true, 4.6, 89),
('Rice Brightening Serum', 'Powerful brightening serum with Rice Extract and Niacinamide', 999.00, 2000.00, 'https://your-domain.com/serum.jpg', 'serum', true, true, 4.8, 127),
('May Secret Glow Combo Pack', 'Complete daily skin protection and brightening routine', 1799.00, 2999.00, 'https://your-domain.com/combo.jpg', 'combo', true, true, 4.7, 45);
```

## 6. Authentication Setup

1. Go to Supabase Project → Authentication → Settings
2. Enable email/password signup
3. Configure site URL: `https://maysecret.in`
4. Configure redirect URLs:
   - `https://maysecret.in/**`
   - `http://localhost:3000/**` (for development)

## 7. Storage Bucket (For Product Images)

1. Go to Supabase Project → Storage
2. Create new bucket: `products`
3. Make bucket public
4. Set up CORS policy if needed

## 8. Functions (Optional - for Razorpay Webhooks)

Create a Supabase Edge Function to handle Razorpay webhooks:
```sql
-- This would be created as a Supabase Edge Function
-- See the paymentService.ts for webhook handling
```

## 9. Testing

1. Start your React app: `npm start`
2. Test user registration/login
3. Test adding products to cart
4. Test checkout flow
5. Verify data in Supabase dashboard

## 10. Production Deployment

1. Update environment variables in Vercel dashboard
2. Ensure Supabase project is in production mode
3. Test all functionality with production URLs
4. Monitor Supabase logs for any issues

## Troubleshooting

### Common Issues:
- **CORS errors**: Check Supabase CORS settings
- **RLS policy errors**: Verify policies allow required operations
- **Authentication errors**: Check JWT token and user session
- **Database connection errors**: Verify environment variables

### Debug Tips:
- Use Supabase dashboard to test queries
- Check browser console for detailed error messages
- Verify network requests in browser dev tools
- Test with different user roles and permissions

## Next Steps

After setting up the database:
1. Update your product images in Supabase Storage
2. Configure Razorpay webhook endpoints
3. Set up monitoring and analytics
4. Test the complete user flow
5. Deploy to production

For support, check Supabase documentation at [supabase.com/docs](https://supabase.com/docs)
