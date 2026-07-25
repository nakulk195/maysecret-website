-- Update only featured May Secret MRP values.
-- Selling prices are intentionally not modified here.

update public.products
set
  original_price = 999,
  updated_at = now()
where lower(name) in (
  lower('MAY SECRET Sunscreen Spray'),
  lower('May Secret Sunscreen Spray')
);

update public.products
set
  original_price = 1499,
  updated_at = now()
where lower(name) = lower('Rice Brightening Serum');

update public.products
set
  original_price = 2498,
  updated_at = now()
where lower(name) = lower('May Secret Glow Combo Pack');

update public.products
set
  original_price = 2998,
  updated_at = now()
where lower(name) = lower('Brightening Serum Combo Pack');

update public.products
set
  original_price = 1998,
  updated_at = now()
where lower(name) = lower('Sunscreen Spray Combo Pack');
