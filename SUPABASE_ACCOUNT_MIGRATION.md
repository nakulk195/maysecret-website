# Switching MAY SECRET to a New Supabase Account

Use this checklist when moving the website to a different Supabase project.

## 1. Create the New Supabase Project

1. Open Supabase and create a new project.
2. Save the database password safely.
3. Go to Project Settings > API.
4. Copy:
   - Project URL
   - anon public key

## 2. Create Tables in the New Project

Run this file in the new Supabase SQL Editor:

```text
supabase/new_project_setup.sql
```

This creates the current app tables, policies, RLS, and API grants.

Important: New Supabase projects may require explicit table grants before the REST/Data API works. The setup SQL includes those grants.

## 3. Import CSV Data

Safe to import in every new project:

1. `products_rows.csv`
2. `coupons_rows.csv`

Only import these if you also migrate the same Supabase Auth users and IDs:

1. `profiles_rows.csv`
2. `addresses_rows (2).csv`
3. `orders_rows (2).csv`
4. `order_items_rows (1).csv`
5. `cart_rows.csv`
6. `wishlist_rows.csv`

Why: profiles, addresses, cart, wishlist, and orders belong to Supabase Auth user IDs. If the new project has different user IDs, old user-owned rows will not match the logged-in users.

After CSV import, run:

```text
supabase/after_csv_import.sql
```

This prevents future product/order number collisions.

## 4. Recommended Migration Choice

For a clean new store setup:

1. Import only products and coupons.
2. Let users log in again.
3. The app will create new profiles automatically.
4. New carts, wishlists, addresses, and orders will save under the new account.

For a full historical migration:

1. Use a full Supabase database backup/restore or CLI/database dump.
2. Include the `auth` schema users and identities.
3. Then import or restore user-owned public tables.

CSV files alone are not enough for a full user/order migration because they do not include `auth.users`.

## 5. Update Local Environment

Update your local `.env` file:

```bash
REACT_APP_SUPABASE_URL=https://your-new-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-new-supabase-anon-public-key
```

Do not add a Supabase service-role key to React. Never use `REACT_APP_SUPABASE_SERVICE_ROLE_KEY`.

## 6. Update Vercel Environment Variables

In Vercel project settings, update these for Production, Preview, and Development:

```text
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
```

Then redeploy the latest GitHub commit.

## 7. Auth Settings

In the new Supabase project:

1. Go to Authentication > URL Configuration.
2. Site URL:

```text
https://maysecret.in
```

3. Add redirect URLs:

```text
https://maysecret.in/**
http://localhost:3000/**
```

If Google login is used, update Google Cloud OAuth redirect URI to:

```text
https://your-new-project-ref.supabase.co/auth/v1/callback
```

Then add the Google Client ID and Client Secret in Supabase Authentication > Providers > Google.

## 8. Verify

After switching:

1. Run `npm run build`.
2. Open the local website.
3. Test email login.
4. Test Google login.
5. Test add to cart.
6. Test wishlist.
7. Test address save.
8. Test COD order.
9. Test Razorpay order.
10. Confirm rows are saved in the new Supabase tables.
