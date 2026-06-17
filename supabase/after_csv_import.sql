-- Run this after importing CSV files into the new Supabase project.
-- It moves generated number sequences above the imported data.

select setval(
  'public.products_product_number_seq',
  greatest(coalesce((select max(product_number) from public.products), 0), 1),
  true
);

select setval(
  'public.orders_order_number_seq',
  greatest(coalesce((select max(order_number) from public.orders), 1000), 1000),
  true
);
