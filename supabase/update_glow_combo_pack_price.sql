-- Update May Secret Glow Combo Pack price in Supabase.
-- New sale price: 879. Original price is 2498.

update public.products
set
  price = 879,
  original_price = 2498,
  updated_at = now()
where lower(name) = lower('May Secret Glow Combo Pack');
