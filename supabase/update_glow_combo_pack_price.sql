-- Update May Secret Glow Combo Pack price in Supabase.
-- New sale price: 1299. Original price remains 2498, so the offer is 48% off.

update public.products
set
  price = 1299,
  original_price = 2498,
  updated_at = now()
where lower(name) = lower('May Secret Glow Combo Pack');

